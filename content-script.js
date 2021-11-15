console.log('[启动插件]', document, GlobalParams)
const { urlRuleSlot, urlRule, widthMap, darkStyle } = GlobalParams;
const { DefaultStyleFlag, DefaultDarkStyleFlag, WebsiteRuleUrl } = GlobalConstant;
const { getCurrentRule, getCurrentRuleCSS, resetCssByStyle, addCssByStyle, initRules } = GlobalUtils;

// 读取本地已经缓存的 mode 模式
const initMode = async (rules = urlRule) => {
    const params = await chrome.storage.local.get("mode");
    // 本地没有保存规则的时候，才设置
    if (!params.mode) {
        chrome.storage.local.set({"mode": 'default'});
    }
    if(params.mode === 'default') {
        resetCssByStyle(DefaultStyleFlag);
    }else {
        const css = getCurrentRuleCSS({
            width: widthMap[params.mode || 'default'],
            slot: urlRuleSlot,
            rules
        })
        addCssByStyle(css, DefaultStyleFlag)
    }
}

// 读取本地已经缓存的 isDarkMode 模式
const initDarkMode = async () => {
    const params = await chrome.storage.local.get("isDarkMode");
    const { isDarkMode } = params;
    // 先清理掉样式，然后在根据是否启用来添加设置
    const element = document.querySelector("#" + DefaultDarkStyleFlag);
    if(element){
        element.remove()
    }
    if(isDarkMode){
        addCssByStyle(darkStyle, DefaultDarkStyleFlag)
    }
}

// 读取本地已经缓存的网站规则
const initRule = async () => {
    const params = await chrome.storage.local.get([WebsiteRuleUrl]);
    const rules = params[WebsiteRuleUrl];
    const rulesList = rules && JSON.parse(rules);
    console.log('[rulesList]', rulesList)
    return rulesList;
}

// 初始化事件监听
const initMessageListener = (rules) => {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
    {
        const { params = {} } = message;
        const { type, value } = params;
        if(type === 'mode') {
            initMode(rules);
        }else if(type === 'isDarkMode') {
            initDarkMode(value);
        }
        setTimeout(function() {
             sendResponse({farewell: "ok"});//做出回应
        }, 1);
        // 这边必须返回 true，否则报错：Unchecked runtime.lastError: The message port closed before a response was received.
        // https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon
        // https://blog.csdn.net/lamp_yang_3533/article/details/100174074?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.essearch_pc_relevant&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.essearch_pc_relevant
        return true
    });
}

const isValidUrl = async () => {
    const params = await chrome.storage.local.get([WebsiteRuleUrl]);
    const cacheRules = params[WebsiteRuleUrl];
    let rules = urlRule;
    if(cacheRules){
        rules = JSON.parse(cacheRules);
    }
    const urls = GlobalUtils.cutUrlHref();
    console.log('[rules rules]', rules)
    let res = false;
    urls && rules && 
    Object.values(rules).length > 0 && 
    Object.values(rules).forEach(item => {
        if(item.url.includes(urls)){
            res = true;
        }
    })
    return res;
}

// 初始化入口
const init = async () => {
    const curIsValidUrl = await isValidUrl();
    console.log('[isValidUrl curIsValidUrl]', curIsValidUrl)
    // 已设置规则的网址才要做初始化处理
    if(curIsValidUrl){
        const rules = await initRule();
        await initMode(rules);
        initMessageListener(rules);
        await initDarkMode();
    }
}

init();