const defaultMode = 'default';

chrome.runtime.onInstalled.addListener(() => {
    console.log(`插件加载完成`);
    // 初始化缓存规则
    chrome.storage.local.get("rule", params => {
        // 本地没有保存规则的时候，才设置
        if (!params) {
            chrome.storage.local.set({"rule": urlRule});
        }
    })

    // 初始化模式
    chrome.storage.local.get("mode", params => {
        const curMode = params.mode || defaultMode
        if (!curMode) {
            chrome.storage.local.set({ mode: defaultMode });
        }
        console.log(`插件加载完成，当前模式：${curMode}`);
    })
});