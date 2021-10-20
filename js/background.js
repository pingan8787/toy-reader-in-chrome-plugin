let defaultMode = 'default';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("mode", params => {
        const curMode = params.mode || defaultMode
        if(!curMode){
            chrome.storage.sync.set({ mode: defaultMode });
        }
        console.log(`插件加载完成，当前模式：${curMode}`);
    })
});