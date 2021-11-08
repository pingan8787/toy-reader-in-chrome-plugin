## 自定义网站规则

支持配置多个规则的键值对，以 JSON 字符串形式保存。
key 名称：WEBSITE_RULE_URL
JSON 格式如下：

```json
[
  {
    "url": "https://www.pingan8787.com",
    "rule": ".container",
    "source": "custom"
  }
]
```

字段意思:

- `url`: 匹配的规则地址
- `rule`：匹配的规则内容
- `source`：当前规则的来源，没有该字段表示来自系统内

## content_scripts 配置规则

由于支持自定义网站规则，所以 `content_scripts` 不能写死，即不能写成下面这样：

```js
"matches": [
	"https://*.juejin.cn/post/*",
	"https://blog.csdn.net/*",
	"https://mp.weixin.qq.com/s/*",
	"https://segmentfault.com/a/*",
	"https://zhuanlan.zhihu.com/p/*"
],
```

## executeScript 内无法读取 popup.js 的内容
```js
// chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: fn,
//     args: [{ // executeScript 内无法读取 popup.js 的内容，所以需要通过 args 注入
//         config: GlobalParams,
//         constant: GlobalConstant
//     }]
// });
```

## 自定义规则演示
w3cschool 演示：
```
网址：https://www.w3cschool.cn/

规则：#pcover

隐藏：.right-item, #rfbanner
```

慕课网手记演示：
```
网址：https://www.imooc.com/article

规则：.left_essay, .main_con

隐藏：.right_recommend, .active-box
```

腾讯云社区演示：
```
网址：https://cloud.tencent.com/developer/article/

规则：.J-body.col-body.pg-2-article

隐藏：.J-sharingBar, .layout-side
```

## chrome.tabs.query 获取到的 tabs 数据格式

```js
{
  active: true
  audible: false
  autoDiscardable: true
  discarded: false
  favIconUrl: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png"
  groupId: -1
  height: 894
  highlighted: true
  id: 5637
  incognito: false
  index: 12
  mutedInfo: {muted: false}
  pinned: false
  selected: true
  status: "complete"
  title: "200 行 TypeScript 代码实现一个高效缓存库 - 掘金"
  url: "https://juejin.cn/post/7025388732802924557"
  width: 1262
  windowId: 681
}
```