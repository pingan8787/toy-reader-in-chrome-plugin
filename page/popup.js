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
                const css = config.rule.replace(reg, width);
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

// 获取当前 url 详细信息，并检查是否是有效 url
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

function initAddRule () {
    const { WebsiteRuleUrl } = GlobalConstant;
    const { urlRuleText } = GlobalParams;
    $('#toggleAddRule').click(function() {
        // TODO: 获取规则的逻辑要放到页面打开的时候
        chrome.storage.local.get([WebsiteRuleUrl], (params) => {
            console.log('[WebsiteRuleUrl 2]', params)
        })
        $('#toggleInputRule').fadeToggle("slow","linear");
        $('#toggleAddRule .show').toggle("slow","linear");
        $('#toggleAddRule .hide').toggle("slow","linear");
    })

    // 网站规则 - 添加操作
    $('#saveRuleButton').click(function() {
        chrome.storage.local.get([WebsiteRuleUrl], (params) => {
            console.log('[WebsiteRuleUrl]', params)
            
            const urlText = $('#custom_rule_url').val();
            const ruleText = $('#custom_rule_content').val() + '/*';
            const hiddenText = $('#custom_rule_hidden').val();
            let result = [];
            const cacheRule = params[WebsiteRuleUrl] && JSON.parse(params[WebsiteRuleUrl]);
            // 如果缓存已经有，则直接使用，没有的话就用空数组
            if(cacheRule && cacheRule.length > 0){
                result = cacheRule;
            }
            const curRule = {
                url: urlText,
                source: 'custom',
                rule: `
                    ${ruleText} {${urlRuleText}}
                    ${hiddenText} {
                        display: none !important;
                    }
                `
            };
            result.push(curRule)
            saveNewRule(curRule);
            chrome.storage.local.set({ [WebsiteRuleUrl]: JSON.stringify(result) });
            console.log('[输入内容]', urlText, ruleText)
        });
    })
    // 网站规则 - 重置操作
    $('#resetRuleButton').click(function() {
        chrome.storage.local.set({ [WebsiteRuleUrl]: '' });
        clearNewRule();
    })
}

// 往路由配置规则中添加当前规则，如果已经存在，则替换
function saveNewRule (newRule) {
    if(!newRule) return;
    const { url } = newRule;
    const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    const urlRegRes = urlReg.exec(url);
    GlobalParams.urlRule[urlRegRes[0]] = newRule
    console.log('[保存规则]',GlobalParams.urlRule)
}

// 清空自定义配置的规则
function clearNewRule () {
    for(const k in GlobalParams.urlRule){
        const value = GlobalParams.urlRule[k]
        if(value['source'] === 'custom'){
            delete GlobalParams.urlRule[k];
        }
    }
    console.log('[清空规则]',GlobalParams.urlRule)
}

window.onload = function () {
    load();
    initAddRule();
};
