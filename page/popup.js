function init () {
    const defaultMode = 'default'; // 默认选中模式

    // 绑定单选按钮事件，修改配置
    $('#mode-select').find('input[type="radio"]').bind('click', function(){
        const value = $(this).attr('value')
        change(value);
    })


    // 重置操作
    $('#reset-button').bind('click', function (){
        $("#mode-select").find('input[type=radio]').attr("checked", false); 
        $("#mode-select").find('input[type=radio][value="default"]').prop("checked", true); 
        reset();
    })

    // 通用处理函数
    const handle = async (fn) => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: fn
        });

    }

    // 修改操作
    const change = async (type = defaultMode) => {
        chrome.storage.sync.set({ mode: type });
        handle(setPageMode);
    }

    // 重置操作
    const reset = async (type = defaultMode) => {
        handle(resetPage);
    }


    function setPageMode() {
        const defaultStyleFlag = "CHROME_PLUGIN_MP_WEIXIN";
        const widthMap = { // 考虑到可能要重置，或者修改为 px 单位，所以这边要能支持换单位
            default: "50%",
            width: "75%",
            full: "100%"
        }
        const urlRule = {
            juejin: {
                url: 'https://juejin.cn/',
                default: '.container.main-container', // 设置默认值的时候的参考元素
                css: width => {
                    return `
                        .container.main-container {
                            width: ${width}!important;
                            max-width: ${width}!important;
                        }
                        .main-area {
                            width: ${width}!important;
                            max-width: ${width}!important;
                        }
                        .sidebar {
                            display: none;
                        }
                        
                    `
                }
            },
            mp: {
                url: 'https://mp.weixin.qq.com/s/',
                default: '.rich_media_area_primary_inner', 
                css: width => `
                    .rich_media_area_primary_inner {
                        width: ${width}!important;
                        max-width: ${width}!important;
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
                url: 'https://blog.csdn.net/',
                default: '#mainBox', 
                css: width => `
                    #mainBox {
                        width: ${width}!important;
                        max-width: ${width}!important;
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
                url: 'https://segmentfault.com/',
                default: '.article-content.container', 
                css: width => `
                    .article-content.container {
                        width: ${width}!important;
                        max-width: ${width}!important;
                    }
                    /* 广告弹框 */
                    .right-side {
                        display: none !important;
                    }
                `
            },
            zhihu: {
                url: 'https://zhuanlan.zhihu.com/p/',
                default: '.Post-Main .Post-Header', 
                css: width => `
                    .TitleImage,
                    .Post-Main .Post-Header,
                    .Post-Main .Post-RichTextContainer {
                        width: ${width}!important;
                        max-width: ${width}!important;
                    }
                    /* 广告弹框 */
                    .right-side {
                        display: none !important;
                    }
                    /* 特殊处理 */
                    .Post-SideActions {
                        right: 0;
                    }
                `
            }
        }
        chrome.storage.sync.get("mode", params => {
            const { mode = "default" } = params;
            console.log('[params]', params, window.location.href)

            function addCssByStyle(cssString) {
                const doc = document, style = doc.createElement("style");
                style.setAttribute("type", "text/css");
                style.setAttribute("id", defaultStyleFlag);

                if (style.styleSheet) {// IE 
                    style.styleSheet.cssText = cssString;
                } else {// w3c 
                    var cssText = doc.createTextNode(cssString);
                    style.appendChild(cssText);
                }

                var heads = doc.getElementsByTagName("head");
                if (heads.length)
                    heads[0].appendChild(style);
                else
                    doc.documentElement.appendChild(style);
            }
            // 获取判断当前平台的 CSS 规则，因为每个平台需要修改的容器不同
            function getRule(){
                const url = window.location.href;
                let result = null;
                for(let k in urlRule){
                    const item = urlRule[k];
                    if(url.includes(item.url)){
                        result = item;
                    }
                }
                return result;
            }
            // 获取默认样式
            function getDefaultStyle(sel){
                const element = document.querySelector(sel);
                const defaultEleStyle = window.getComputedStyle(element);
                const { width } = defaultEleStyle;
                widthMap.default = width;
            }
            // 先判断当前是否已经创建了该 style 标签
            // 如果已经创建，则先删除在创建
            // 否则直接创建
            const pluginStyleTag = document.getElementById(defaultStyleFlag)
            if(pluginStyleTag){
                pluginStyleTag.remove();
            }
            const ruleConfig = getRule();
            if(ruleConfig){
                // 先保存默认宽度下来，用来做重置的时候用
                getDefaultStyle(ruleConfig.default);
                const cssStyle = ruleConfig.css(widthMap[mode]);
                // 添加样式
                addCssByStyle(cssStyle);
            }
        });
    }

    function resetPage() {
        const defaultStyleFlag = "CHROME_PLUGIN_MP_WEIXIN";
        const element = document.querySelector('#' + defaultStyleFlag);
        element && element.remove();

    }
}


window.onload = function () {
    init();
}