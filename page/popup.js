function load() {

    // 绑定单选按钮事件，修改配置
    $("#select-mode")
        .find('input[type="radio"]')
        .bind("click", function () {
            const value = $(this).attr("value");
            chrome.storage.local.set({ mode: value || DefaultMode });
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
    const handle = async (fn) => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fn,
            args: [{
                config: GlobalParams,
                constant: Constant
            }]
        });
    };

    // 初始化读取缓存 - mode
    chrome.storage.local.get("mode", (params) => {
        $(`#select-mode input[type="radio"][value="${params.mode}"]`).click();
    })

    // 初始化读取缓存 - dark
    chrome.storage.local.get("isDarkMode", (params) => {
        $("#viewMode").attr('checked', !params.isDarkMode)
        $("#viewMode").click();
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

window.onload = function () {
    load();
};
