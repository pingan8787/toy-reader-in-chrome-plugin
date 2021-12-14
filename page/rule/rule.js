const { urlRule, urlRuleText, urlRuleNone, urlDefaultRule } = GlobalParams;
const { DefaultStyleFlag, DefaultDarkStyleFlag, WebsiteRuleUrl } = GlobalConstant;

const load = async () => {
    await initCache();
    hljs.highlightAll();
}

const updateCountText = (sel, count) => {
    $(sel).text(count);
}

// 初始化页面选项
const initCache = async () => {
    // 初始化读取缓存 - mode
    let rules = await chrome.storage.local.get([WebsiteRuleUrl]);
    // 默认刚进来，列表为空，所以取默认配置的列表
    if(!(rules && rules[WebsiteRuleUrl])){
        rules[WebsiteRuleUrl] = JSON.stringify(urlRule);
        await chrome.storage.local.set({[WebsiteRuleUrl]: JSON.stringify(urlRule)});
    }
    const ruleList = rules[WebsiteRuleUrl] && typeof rules[WebsiteRuleUrl] === 'string' 
        ? JSON.parse(rules[WebsiteRuleUrl]) 
        : {};
    updateCountText('#ruleCount', Object.keys(ruleList).length);
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
    updateCountText('#ruleTypeCount', Object.keys(ruleObj.default).length);
    updateCountText('#ruleCustomCount', Object.keys(ruleObj.custom).length);
    return ruleObj;
}

const renderRuleToPage = (select, list, iconColor = '#2E94B9') => {
    let html = '';
    for(const key in list){
        const { alias, rule, url, createTime } = list[key];
        const createTimeStr = createTime ? `<div class="rule-url">创建时间：${createTime}</div>` : '';
        html += `
            <li>
                <div class="rule-name"><i class="rule-icon" style="background-color:${iconColor}"></i>${alias}</div>
                <div class="rule-url">标识：${key}</div>
                <div class="rule-url">网址：${url}</div>
                ${createTimeStr}
                <div class="rule-text">规则：<pre id="code-${key}"><img class="rule-editor-button" title="编辑" src="../assets/icon/icon-editor.png" onclick="editorRule('${key}')" /><code class="css">${rule}</code></pre></div>
            </li>
        `
    }
    $(select).append(html);
}

// 渲染规则数据
const renderRuleList = rules => {
    const ruleObj = handleRuleList(rules);
    renderRuleToPage('#ruleDefault', ruleObj.default);
    renderRuleToPage('#ruleCustom', ruleObj.custom, '#F0B775');
}

// 编辑代码
const editorRule = source => {
    console.log('[编辑的数据]',source)
    alert('开发中')
}


window.onload = function () {
    load();
};
