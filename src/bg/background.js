'use strict';

function openIncognito(url) {
    console.log("Attempting to open URL incognito: ", url);
    chrome.windows.getAll({}, function (wins) {
        var incognitoWins = wins.filter(function (w) { return w.incognito; });
        var focussedWins = wins.filter(function (w) { return w.focused; });

        var state = (focussedWins.length > 0)
                        ? (focussedWins[0].state || "normal")
                        : "normal";

        if (incognitoWins.length > 0 && typeof incognitoWins[0].id !== "undefined") {
            chrome.tabs.create({ url: url, windowId: incognitoWins[0].id });
        } else {
            try {
                chrome.windows.create(
                    { url: url
                    , incognito: true
                    // May not be able to use `state` as it is supported
                    // only in Chrome 41 and beyond.
                    , state: state
                    }
                );
            } catch(e) {
                console.log("Trying without `state`");
                chrome.windows.create(
                    { url: url
                    , incognito: true
                    }
                );
            }
        }
    });
}

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        openIncognito(request.url);
        sendResponse(true);
    }
);

chrome.browserAction.onClicked.addListener(
    function(tab) {
        openIncognito(tab.url);
    }
);
