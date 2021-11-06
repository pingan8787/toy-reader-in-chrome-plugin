async function load() {
    const { isValidUrl, tab } = await currentIsValidUrl();
    if(!isValidUrl) return;
    // 绑定单选按钮事件，修改配置
    $("#select-mode").find('input[type="radio"]')
        .bind("click", function () {
            const value = $(this).attr("value");
            const params = { mode: value || GlobalConstant.DefaultMode };
            chrome.storage.local.set(params);
            handle({
                type: 'mode',
                value
            });
        });

    // 重置操作
    $("#reset-button").bind("click", function () {
        $("#select-mode").find("input[type=radio]").attr("checked", false);
        $("#select-mode").find('input[type=radio][value="default"]').prop("checked", true);
        const params = { mode: GlobalConstant.DefaultMode };
        chrome.storage.local.set(params);
        handle({
            type: 'mode',
            value: 'default'
        });
    });

    // 黑夜模式开关
    $("#viewMode").bind("click", function () {
        const value = $(this)[0].checked;
        chrome.storage.local.set({ isDarkMode: value });
        handle({
            type: 'isDarkMode',
            value
        });
    });

    // 通用处理函数
    const handle = params => {
        chrome.tabs.sendMessage(tab.id, {
            message: "UPDATE",
            params
        }, function(response){
        });
    };
    initCache();
}

// 初始化页面选项
function initCache () {
    // 初始化读取缓存 - mode
    chrome.storage.local.get("mode", (params) => {
        $(`#select-mode input[type="radio"][value="${params.mode}"]`).click();
    })

    // 初始化读取缓存 - dark
    chrome.storage.local.get("isDarkMode", (params) => {
        $("#viewMode").attr('checked', params.isDarkMode)
    })
}

// 获取当前 url 详细信息，并检查是否是有效 url
async function currentIsValidUrl () {
    // https://developer.chrome.com/docs/extensions/reference/tabs/#method-query
    const curRules = await initGlobalRules();
    const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
    const curTabs = tabs[0];
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
    /* tabs 数据结构如下
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
    const { urlRuleText, urlDefaultRule } = GlobalParams;
    $('#toggleAddRule').click(async function() {
        // TODO: 获取规则的逻辑要放到页面打开的时候
        const params = await chrome.storage.local.get([WebsiteRuleUrl])
        $('#toggleInputRule').fadeToggle("slow","linear");
        $('#toggleAddRule .show').toggle("slow","linear");
        $('#toggleAddRule .hide').toggle("slow","linear");
    })
    $('#showDemoModal').click(function() {
        $('#ruleDemoModal').show("fast","linear");
    })
    $('#closeDemoModal').click(function() {
        $('#ruleDemoModal').hide("fast","linear");
    })

    // 网站规则 - 添加操作
    $('#saveRuleButton').click(async function() {
        const params = await chrome.storage.local.get([WebsiteRuleUrl]);
        const urlText = $('#custom_rule_url').val();
        const ruleText = $('#custom_rule_content').val();
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
        const newRules = saveNewRule(curRule);
        chrome.storage.local.set({ [WebsiteRuleUrl]: JSON.stringify(newRules) });
        alert('保存成功！')
    })
    // 网站规则 - 重置操作
    $('#resetRuleButton').click(function() {
        chrome.storage.local.set({ [WebsiteRuleUrl]: JSON.stringify(urlDefaultRule) });
        clearNewRule();
        alert('重置成功，恢复默认配置！')
    })
}

// 往路由配置规则中添加当前规则，如果已经存在，则替换
function saveNewRule (newRule) {
    if(!newRule) return;
    const { url } = newRule;
    const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    const urlRegRes = urlReg.exec(url);
    GlobalParams.urlRule[urlRegRes[0]] = newRule
    return GlobalParams.urlRule;
}

// 清空自定义配置的规则
function clearNewRule () {
    for(const k in GlobalParams.urlRule){
        const value = GlobalParams.urlRule[k]
        if(value['source'] === 'custom'){
            delete GlobalParams.urlRule[k];
        }
    }
}

// [非常重要]初始化配置的规则
async function initGlobalRules () {
    const rules = await initRules();
    GlobalParams.urlRule = rules;
}

window.onload = function () {
    load();
    initAddRule();
};
