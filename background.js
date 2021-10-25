const defaultMode = 'default';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("mode", params => {
        const curMode = params.mode || defaultMode
        if(!curMode){
            chrome.storage.local.set({ mode: defaultMode });
        }
        console.log(`插件加载完成，当前模式：${curMode}`);
    })
});