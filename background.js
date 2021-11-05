const defaultMode = 'default';

chrome.runtime.onInstalled.addListener(() => {
    console.log(`插件加载完成`);

    // 初始化缓存规则
    chrome.storage.local.get("rule", params => {
        // 本地没有保存规则的时候，才设置
        if (!params) {
            chrome.storage.local.set({ "rule": urlRule });
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

chrome.contextMenus.create({
    id: 'ToyReader',
    title: "生成分享链接: %s",
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    const { selectionText, pageUrl } = info;
    const copyText = `[${selectionText}](${pageUrl})`;
    console.log('【ToyReader 复制内容】', copyText)
    try {
        await navigator.clipboard.writeText(copyText);
    } catch (error) {
        function copyFun(args) {
            const { copyText } = args;
            const n = document.createElement("textarea");
            n.textContent = copyText;
            document.body.appendChild(n);
            n.select();
            document.execCommand("Copy", false);
        }

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: copyFun,
            args: [{ copyText }]
        });
    }
    // 注意不能使用location.href，因为location是属于background的window对象
    // chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
});

function getCurrentPage () {
    return {
        window,
        document
    }
}