const { urlRule, urlRuleText, urlRuleNone, urlDefaultRule } = GlobalParams;
const { DefaultStyleFlag, DefaultDarkStyleFlag, WebsiteRuleUrl } = GlobalConstant;

const load = async () => {
    await initCache();
    hljs.highlightAll();
}

// 初始化页面选项
const initCache = async () => {
    // 初始化读取缓存 - mode
    let rules = await chrome.storage.local.get([WebsiteRuleUrl]);
    // 默认刚进来，列表为空，所以取默认配置的列表
    if(!(rules && rules[WebsiteRuleUrl])){
        rules[WebsiteRuleUrl] = JSON.stringify(urlRule);
        await chrome.storage.local.set({[WebsiteRuleUrl]: rules});
    }
    const ruleList = JSON.parse(rules[WebsiteRuleUrl]);
    renderRuleList(ruleList);
}

// 处理规则数据
const handleRuleList = rules => {
    const ruleObj = {
        default: {},
        custom: {},
    };
    for(const k in rules){
        const item = rules[k];
        const { source, createTime } = item;
        if(source && source == 'custom'){
            ruleObj.custom[k] = item;
        }else {
            ruleObj.default[k] = item;
        }
    }
    return ruleObj;
}

const renderRuleToPage = (select, list, iconColor = '#2E94B9') => {
    let html = '';
    for(const k in list){
        const { rule, url } = list[k];
        html += `
            <li>
                <div class="rule-name"><i class="rule-icon" style="background-color:${iconColor}"></i>${k}</div>
                <div class="rule-url">网址：${url}</div>
                <div class="rule-text">规则：<pre><code class="css">${rule}</code></pre></div>
            </li>
        `
    }
    $(select).append(html);
}

// 渲染规则数据
const renderRuleList = rules => {
    const ruleObj = handleRuleList(rules);
    console.log('[ruleObj]', ruleObj)
    renderRuleToPage('#rule-default', ruleObj.default);
    renderRuleToPage('#rule-custom', ruleObj.custom, '#F0B775');
}


window.onload = function () {
    load();
};
