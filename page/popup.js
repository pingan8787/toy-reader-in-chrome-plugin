// Initialize button with user's preferred color

function init () {
    let saveButton = document.getElementById("save-button");

    saveButton.addEventListener("click", async () => {
        console.log("保存成功", $('input[name="width"]:checked').val())
        const checkVal = $('input[name="width"]:checked').val();
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.storage.sync.set({ mode: checkVal });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setPageMode,
        });
    });


    function setPageMode() {
        const widthMap = {
            default: 50,
            width: 75,
            full: 100
        }
        chrome.storage.sync.get("mode", params => {
            const { mode = "default" } = params;
            const curWidth = widthMap[mode];
            console.log('[params]', params)

            function addCssByStyle(cssString) {
                var doc = document;
                var style = doc.createElement("style");
                style.setAttribute("type", "text/css");

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
            addCssByStyle(`
                .rich_media_area_primary_inner {
                    width: ${curWidth}%!important;
                    max-width: ${curWidth}%!important;
                }
            `)
        });
    }
}


window.onload = function () {
    init();
}