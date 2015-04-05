chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Attempting to open URL incognito: ", request.url);
        chrome.windows.create({ url: request.url, incognito: true });
        sendResponse(true);
    }
);
