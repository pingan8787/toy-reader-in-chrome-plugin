console.log('[启动插件]', document)

// 读取本地已经缓存的 mode 模式
chrome.storage.local.get("mode", params => {
    const { urlRuleSlot, urlRule, widthMap } = GlobalParams;
    const { DefaultStyleFlag } = GlobalConstant;
    // 本地没有保存规则的时候，才设置
    if (!params.mode) {
        chrome.storage.local.set({"mode": urlRule});
    }
    if(params.mode === 'default') {
        resetCssByStyle(DefaultStyleFlag);
    }else {
        const css = getCurrentRuleCSS({
            width: widthMap[params.mode || 'default'],
            slot: urlRuleSlot,
            rules: urlRule
        })
        addCssByStyle(css, DefaultStyleFlag)
    }
})

// 读取本地已经缓存的 isDarkMode 模式
chrome.storage.local.get("isDarkMode", params => {
    const { darkStyle } = GlobalParams;
    const { DefaultDarkStyleFlag } = GlobalConstant;
    const { isDarkMode } = params;
    if(isDarkMode){
        const element = document.querySelector("#" + DefaultDarkStyleFlag);
        if(element){
            element.remove()
        }
        addCssByStyle(darkStyle, DefaultDarkStyleFlag)
    }
})

// 保存当前页面 URL，其他地方需要使用
chrome.storage.local.set({
    currentUrlHref: window.location.href,
    currentUrlHost: window.location.host,
});