// 获取判断当前平台的 CSS 规则，因为每个平台需要修改的容器不同
const getCurrentRule = rules => {
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
const getCurrentRuleCSS = params => {
    const { width, rules, slot } = params;
    const config = getCurrentRule(rules);
    const reg = new RegExp(slot, 'gi');
    const css = config.rule.replace(reg, width);
    return css;
}

// 添加全局样式
function addCssByStyle(cssString, flag) {
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
function resetCssByStyle(flag) {
    const element = document.querySelector("#" + flag);
    element && element.remove();
}