// Initialize button with user's preferred color

window.onload = function () {
    let changeColor = document.getElementById("changeColor");
    console.log(changeColor, document)

    changeColor.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setPageBackgroundColor,
        });
    });
    function setPageBackgroundColor() {
        chrome.storage.sync.get("color", ({ color }) => {
            console.log('[document]', document)
            document.body.style.backgroundColor = color;
        });
    }
}