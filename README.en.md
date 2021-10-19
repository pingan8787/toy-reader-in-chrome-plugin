"default_popup": "./page/popup.html"


			"matches": ["https://mp.weixin.qq.com/s/*"],


            ,
	"content_scripts": [
		{
            "matches": ["*://mp.weixin.qq.com/*", "*://www.juejin.cn/*", "*://www.baidu.com/*", "*://blog.haoji.me/*"],
            "js": ["js/test.js"],
            "css": ["css/mp.css"],
            "run_at": "document_idle"
		}
	]




{
	"manifest_version": 2,
	"name": "mp-weixin-for-pingan8787",
	"version": "1.0.0",
	"description": "公众号文章全屏阅读（for pingan8787）",
	"icons": {
		"16": "./image/wx-16.png",
		"48": "./image/wx-48.png",
		"128": "./image/wx-128.png"
	},
	"page_action": {
		"default_icon": "./image/wx-128.png",
		"default_title": "公众号文章全屏阅读（for pingan8787）"
	},
	"permissions": [
		"declarativeContent", "contextMenus", "clipboardRead", "clipboardWrite"
	],
	"background": {
		"scripts": ["js/background.js"]
	},
	"content_scripts": [
		{
            "matches": ["*://mp.weixin.qq.com/*", "*://www.juejin.cn/*", "*://www.baidu.com/*", "*://blog.haoji.me/*"],
            "js": ["js/test.js"],
            "css": ["css/mp.css"],
            "run_at": "document_idle"
		}
	]
}