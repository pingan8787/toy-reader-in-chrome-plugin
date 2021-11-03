async function load() {
    const { isValidUrl, tab } = await currentIsValidUrl();
    if(!isValidUrl) return;
    // 绑定单选按钮事件，修改配置
    $("#select-mode")
        .find('input[type="radio"]')
        .bind("click", function () {
            const value = $(this).attr("value");
            chrome.storage.local.set({ mode: value || GlobalConstant.DefaultMode });
            handle(setPageMode);
        });

    // 重置操作
    $("#reset-button").bind("click", function () {
        $("#select-mode").find("input[type=radio]").attr("checked", false);
        $("#select-mode")
            .find('input[type=radio][value="default"]')
            .prop("checked", true);
        handle(resetPage);
    });

    // 黑夜模式开关
    $("#viewMode").bind("click", function () {
        const value = $(this)[0].checked;
        chrome.storage.local.set({ isDarkMode: value });
        handle(setDarkMode);
    });

    // 通用处理函数
    const handle = fn => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fn,
            args: [{
                config: GlobalParams,
                constant: GlobalConstant
            }]
        });
    };

    // // 初始化读取缓存 - mode
    chrome.storage.local.get("mode", (params) => {
        $(`#select-mode input[type="radio"][value="${params.mode}"]`).click();
    })

    // // 初始化读取缓存 - dark
    chrome.storage.local.get("isDarkMode", (params) => {
        $("#viewMode").attr('checked', params.isDarkMode)
    })

    function setPageMode(args) {
        const { config, constant } = args;
        const { urlRule, urlRuleSlot, widthMap } = config;
        const { DefaultStyleFlag, DefaultMode } = constant;
        chrome.storage.local.get("mode", (params) => {
            const { mode = DefaultMode } = params;
            // 获取判断当前平台的 CSS 规则，因为每个平台需要修改的容器不同
            const getCurrentRule = () => {
                const url = window.location.href;
                let result = null;
                for (let k in urlRule) {
                    const item = urlRule[k];
                    if (url.includes(item.url)) {
                        result = item;
                    }
                }
                return result;
            }

            // 读取当前规则下的 CSS 样式
            const getCurrentRuleCSS = width => {
                const config = getCurrentRule();
                const reg = new RegExp(urlRuleSlot, 'gi');
                const css = config.css.replace(reg, width);
                return css;
            }

            function addCssByStyle(cssString) {
                const doc = document,
                    style = doc.createElement("style");
                style.setAttribute("type", "text/css");
                style.setAttribute("id", DefaultStyleFlag);

                const cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
                const heads = doc.getElementsByTagName("head");
                if (heads.length) heads[0].appendChild(style);
                else doc.documentElement.appendChild(style);
            }
            // 先判断当前是否已经创建了该 style 标签
            // 如果已经创建，则先删除在创建
            // 否则直接创建
            const pluginStyleTag = document.querySelector("#" + DefaultStyleFlag);
            if (pluginStyleTag) {
                pluginStyleTag.remove();
            }
            const currentCss = getCurrentRuleCSS(widthMap[mode]);
            if (currentCss) {
                addCssByStyle(currentCss);
            }
        });
    }

    function resetPage(args) {
        const { config, constant } = args;
        const { DefaultStyleFlag } = constant;
        const element = document.querySelector("#" + DefaultStyleFlag);
        element && element.remove();
        chrome.storage.local.set({ mode: GlobalConstant.DefaultMode });
    }

    function setDarkMode(args) {
        const { config, constant } = args;
        const { darkStyle } = config;
        const { DefaultDarkStyleFlag } = constant;

        chrome.storage.local.get("isDarkMode", (params) => {
            const { isDarkMode } = params;
            function addCssByStyle(cssString) {
                const doc = document,
                    style = doc.createElement("style");
                style.setAttribute("type", "text/css");
                style.setAttribute("id", DefaultDarkStyleFlag);

                const cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
                const heads = doc.getElementsByTagName("head");
                if (heads.length) heads[0].appendChild(style);
                else doc.documentElement.appendChild(style);
            }
            const pluginStyleTag = document.querySelector("#" + DefaultDarkStyleFlag);
            if (isDarkMode) {
                if (pluginStyleTag) {
                    pluginStyleTag.remove();
                }
                addCssByStyle(darkStyle);
            } else {
                pluginStyleTag.remove();
            }
        });
    }
}

function CustomRuleHandle() {
    console.log('[element]', $(".handle-rule-icon"))
    $(".handle-rule-icon").bind("click", function () {
        console.log('[this]', this)
    });
}

async function currentIsValidUrl () {
    // https://developer.chrome.com/docs/extensions/reference/tabs/#method-query
    const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
    const curTabs = tabs[0]; // 数据结构如下
    const urls = GlobalParams.getRuleUrls();
    let isValidUrl = false;
    urls && urls.length > 0 && urls.forEach(item => {
        if(curTabs.url.includes(item)){
            isValidUrl = true;
        }
    })
    console.log('[当前tab]', curTabs, urls, isValidUrl)
    return {
        isValidUrl,
        url: curTabs.url,
        tab: curTabs
    };
    /*
        active: true
        audible: false
        autoDiscardable: true
        discarded: false
        favIconUrl: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png"
        groupId: -1
        height: 894
        highlighted: true
        id: 5637
        incognito: false
        index: 12
        mutedInfo: {muted: false}
        pinned: false
        selected: true
        status: "complete"
        title: "200 行 TypeScript 代码实现一个高效缓存库 - 掘金"
        url: "https://juejin.cn/post/7025388732802924557"
        width: 1262
        windowId: 681
    */
}

window.onload = function () {
    load();
};
