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
    const urls = GlobalUtils.getRuleUrls();
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
}

function initAddRule () {
    const { WebsiteRuleUrl } = GlobalConstant;
    const { urlRuleText, urlRuleNone, urlDefaultRule } = GlobalParams;
    // 显示隐藏添加规则的模块
    $('#toggleAddRule .input').click(async function() {
        // TODO: 获取规则的逻辑要放到页面打开的时候
        const params = await chrome.storage.local.get([WebsiteRuleUrl])
        $('#toggleInputRule').fadeToggle("fast","linear");
        $('#toggleAddRule .show').toggle("fast","linear");
        $('#toggleAddRule .hide').toggle("fast","linear");
    })
    // 显示添加规则示例的弹框
    $('#showDemoModal').click(function() {
        $('#ruleDemoModal').show("fast","linear");
    })
    // 隐藏添加规则示例的弹框
    $('#closeDemoModal').click(function() {
        $('#ruleDemoModal').hide("fast","linear");
    })
    // 跳转查看所有规则列表
    $('#toggleAddRule .list').click(async function() {
        const url = chrome.runtime.getURL("./page/rule/rule.html");
        let tab = await chrome.tabs.create({ url });
    })

    // 网站规则 - 添加操作
    $('#saveRuleButton').click(async function() {
        const urlText = $('#custom_rule_url').val();
        const ruleText = $('#custom_rule_content').val();
        const hiddenText = $('#custom_rule_hidden').val();
        const curRule = {
            url: urlText,
            source: 'custom',
            rule: `
                ${ruleText} {${urlRuleText}}
                ${hiddenText} {${urlRuleNone}}
            `,
            createTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        const newRules = saveNewRule(curRule);
        chrome.storage.local.set({ [WebsiteRuleUrl]: JSON.stringify(newRules) });
        alert('保存成功！')
    })
    // 网站规则 - 重置操作
    $('#resetRuleButton').click(function() {
        chrome.storage.local.set({ [WebsiteRuleUrl]: JSON.stringify(urlDefaultRule) });
        // clearNewRule();
        GlobalParams.urlRule = urlDefaultRule;
        alert('重置成功，恢复默认配置！')
    })
}

// 往路由配置规则中添加当前规则，如果已经存在，则替换
function saveNewRule (newRule) {
    if(!newRule) return;
    const { url } = newRule;
    const resUrl = GlobalUtils.cutUrlHref(url);
    GlobalParams.urlRule[resUrl] = newRule;
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
    const rules = await GlobalUtils.initRules();
    rules && (GlobalParams.urlRule = rules);
    return rules;
}

window.onload = function () {
    load();
    initAddRule();
};
