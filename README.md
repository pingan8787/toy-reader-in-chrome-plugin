## Toy Reader 介绍
Toy Reader，是一款帮助我们专注阅读辅助工具，隐藏你不想看到的内容，设置内容阅读区域宽度，让我们能更加专注的阅读。
支持平台：微信公众号文章、掘金文章、CSDN文章、思否文章。
支持功能：
- 🌓夜间模式（全站点）
- 🖥显示模式（多宽屏模式）
- 选择文章任意内容作为标题，复制当前链接到剪切板

## 拓展：开启黑夜模式

```css
transition: filter 300ms linear;
-webkit-transition: filter 300ms linear;
filter: invert(1) hue-rotate(180deg);
```

## 拓展：隐藏百度广告
```js
setInterval(() => {
    try{
        Array.from(
            document.querySelectorAll('#content_left>div'))
            .forEach(el => 
                />广告</.test(el.innerHTML) && el.parentNode.removeChild(el)
        )
    } catch(e){}
}, 1000)
```

## 更新记录
### v0.1.0 2021.10.24
基础功能上线

### v0.1.1 2021.10.25
- 插件名称更换，配置项更新
- 修改设置缓存位置
- 增加 Github 平台支持

### v0.1.2 2021.11.02
- 增加读取本地缓存，设置一次后，其他相同地址打开都能读取已缓存的配置
- 增加 BUG 反馈入口
- 代码继续优化
### v0.1.3 2021.11.03
- 增加选择页面文本内容，以当前 url 生成 md 内容，如选择“ToyReader”，生成内容如：`[ToyReader](https://github.com/pingan8787)`

