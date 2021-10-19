console.log('插件加载')

const mpUrl = 'https://mp.weixin.qq.com/s'

// 设置图标会的徽章文本
// chrome.browserAction.setBadgeText({ text: 'on' });
// 设置图标会的徽章背景色
// chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

// chrome.tabs.insertCSS({ file: '/css/mp.css' });


async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.runtime.onInstalled.addListener(async (reason) => {
    var css = "body { background: green }";
    // chrome.tabs.insertCSS({ code: css });
    // if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    //   chrome.tabs.create({
    //     url: 'onboarding.html'
    //   });
    // }
});

// chrome.runtime.onInstalled.addListener(function(){
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// 只有打开百度才显示pageAction
// 					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: mpUrl}})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });