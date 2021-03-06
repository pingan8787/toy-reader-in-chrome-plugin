const __plugin__urlRuleSlot =  "{{__width__}}";
const __plugin__widthText = `
    width: ${__plugin__urlRuleSlot}!important;
    max-width: ${__plugin__urlRuleSlot}!important;
    transition: all .25s ease-in-out;
`
const __plugin__widthNone = `
    display: none !important;
    transition: all .25s ease-in-out;
`

const __plugin__urlRule = {
    juejin: {
        url: "https://juejin.cn/",
        alias: '掘金社区',
        rule: 
`
.container.main-container {${__plugin__widthText}}
.main-area {
    width: 100%!important;
    max-width: 100%!important;
    transition: all .25s ease-in-out;
}
.sidebar {
    display: none;
    transition: all .25s ease-in-out;
}
`
    },
    mp: {
        url: "https://mp.weixin.qq.com/s/",
        alias: '微信公众号',
        rule: 
`
.rich_media_area_primary_inner {${__plugin__widthText}}
/* 公众号扫码关注的框 */
.qr_code_pc_inner{
    display: none !important;
}
/* 壹伴插件 */
.mpa-plugin-data-enhance {
    display: none !important;
}
`
    },
    csdn: {
        url: "https://blog.csdn.net/",
        alias: 'CSDN',
        rule: 
`
#mainBox {${__plugin__widthText}}
#mainBox main {
    width: 100%!important;
}
/* 广告弹框 */
.blog_container_aside, 
.recommend-right {
    display: none !important;
}
`
    },
    sf: {
        url: "https://segmentfault.com/",
        alias: '思否社区',
        rule: 
`
.article-content.container {${__plugin__widthText}}
/* 广告弹框 */
.right-side {
    display: none !important;
}
`,
    },
    zhihu: {
        url: "https://zhuanlan.zhihu.com/p/",
        alias: '知乎',
        rule: 
`
.TitleImage,
.Post-Main .Post-Header,
.Post-Main .Post-RichTextContainer {${__plugin__widthText}}
/* 广告弹框 */
.right-side {
    display: none !important;
}
/* 特殊处理 */
.Post-SideActions {
    right: 0;
}
`,
    },
    github: {
        url: "https://github.com/",
        alias: 'Github',
        rule: 
`
.new-discussion-timeline {${__plugin__widthText}}
.gutter-condensed > div:first-child,
.markdown-body {
    width: 100%!important;
    max-width: 100%!important;
}
.gutter-condensed > div:last-child {
    display: none !important;
}
`,
    },
};

// 导出全局配置
const GlobalParams = {
    /*
    替换规则,将 {{__width__}} 作为插槽，后面会用来做替换成正常的宽度的值
    目的是为了做到更灵活替换
    */
    urlRuleSlot: __plugin__urlRuleSlot,
    urlRuleText: __plugin__widthText,
    urlRuleNone: __plugin__widthNone,
    urlRule: __plugin__urlRule,
    urlDefaultRule: {...__plugin__urlRule}, // 备份一份
    widthMap: {
        default: "50%",
        width: "75%",
        full: "100%",
    },
    getRuleUrls: () => {
        let result = [];
        for(let { url } of Object.values(__plugin__urlRule)){
            result.push(url)
        }
        return result;
    },
    darkStyle: `
        html {
            transition: filter 300ms linear;
            -webkit-transition: filter 300ms linear;
            filter: invert(1) hue-rotate(180deg);
        }
    `
}