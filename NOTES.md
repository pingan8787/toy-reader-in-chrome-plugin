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
