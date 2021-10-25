/*
    替换规则
    这边将 {{__width__}} 作为插槽，后面会用来做替换成正常的宽度的值
    目的是为了做到更灵活替换
*/
const urlRuleSlot = "{{__width__}}";
const urlRule = {
    juejin: {
        url: "https://juejin.cn/",
        css: `
            .container.main-container {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
            .main-area {
                width: 100%!important;
                max-width: 100%!important;
            }
            .sidebar {
                display: none;
            }
        `
    },
    mp: {
        url: "https://mp.weixin.qq.com/s/",
        css: `
            .rich_media_area_primary_inner {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
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
        css: `
            #mainBox {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
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
        css: `
            .article-content.container {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
            /* 广告弹框 */
            .right-side {
                display: none !important;
            }
        `,
    },
    zhihu: {
        url: "https://zhuanlan.zhihu.com/p/",
        css: `
            .TitleImage,
            .Post-Main .Post-Header,
            .Post-Main .Post-RichTextContainer {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
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
        css: `
            .new-discussion-timeline {
                width: ${urlRuleSlot}!important;
                max-width: ${urlRuleSlot}!important;
            }
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

const widthMap = {
    default: "50%",
    width: "75%",
    full: "100%",
};

const darkStyle = `
    html {
        transition: filter 300ms linear;
        -webkit-transition: filter 300ms linear;
        filter: invert(1) hue-rotate(180deg);
    }
`;


// 导出全局配置
const GlobalParams = {
    urlRuleSlot,
    urlRule,
    widthMap,
    darkStyle
}