## 介绍
目前支持平台：微信公众号文章、掘金文章、CSDN文章、思否文章

支持在：微信公众号文章、掘金文章、CSDN文章、思否文章，设置阅读时内容显示区域的宽度，提升阅读体验

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

## TODO

[x] 支持掘金、知乎、CSDN等平台  
[x] 支持黑夜模式 
[x] 支持保存默认宽度，来自页面本身 `window.getComputedStyle` 方法获取并保存样式  
[] 支持用户自定义规则  
[] 支持保存用户设置，避免每次打开文章都要设置  