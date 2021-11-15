// 获取判断当前平台的 CSS 规则，因为每个平台需要修改的容器不同
const _getCurrentRule = rules => {
    const url = window.location.href;
    let result = null;
    for (let k in rules) {
        const item = rules[k];
        if (url.includes(item.url)) {
            result = item;
        }
    }
    return result;
}

// 读取当前规则下的 CSS 样式
/*
    params.width width
    params.slot  urlRuleSlot
    params.rules urlRule
*/
const _getCurrentRuleCSS = params => {
    const { width, rules, slot } = params;
    const config = _getCurrentRule(rules);
    if(!config) return '';
    const reg = new RegExp(slot, 'gi');
    const css = config.rule.replace(reg, width);
    return css;
}

// 添加全局样式
const _addCssByStyle = (cssString, flag) => {
    const pluginStyleTag = document.querySelector("#" + flag);
    if (pluginStyleTag) {
        pluginStyleTag.remove();
    }

    const doc = document,
        style = doc.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", flag);

    const cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
    const heads = doc.getElementsByTagName("head");
    if (heads.length) heads[0].appendChild(style);
    else doc.documentElement.appendChild(style);
}

// 重置全局样式
const _resetCssByStyle = flag => {
    const element = document.querySelector("#" + flag);
    element && element.remove();
}

// 读取本地已经缓存的网站规则
const _initRules = async () => {
    const { WebsiteRuleUrl } = GlobalConstant;
    const params = await chrome.storage.local.get([WebsiteRuleUrl]);
    const rules = params[WebsiteRuleUrl];
    const rulesList = rules && JSON.parse(rules);
    return rulesList;
}

const _getRuleUrls = (urls = GlobalParams.urlRule) => {
    let result = [];
    for(let { url } of Object.values(urls)){
        result.push(url)
    }
    return result;
}

const _cutUrlHref = (url = window.location.href) => {
    const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    const urlRegRes = urlReg.exec(url);
    return urlRegRes[0];
}  

// 全局工具方法
const GlobalUtils = {
    getCurrentRule: _getCurrentRule,
    getCurrentRuleCSS: _getCurrentRuleCSS,
    resetCssByStyle: _resetCssByStyle,
    addCssByStyle: _addCssByStyle,
    initRules: _initRules,
    getRuleUrls: _getRuleUrls,
    cutUrlHref: _cutUrlHref
}