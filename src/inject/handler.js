function keyncognitoHandler() {
    var altKeyNeeded   = true,
        shiftKeyNeeded = false,
        metaKeyNeeded  = true,
        ctrlKeyNeeded  = false;

    chrome.storage.sync.get(
        { shiftKey : shiftKeyNeeded,
          metaKey  : metaKeyNeeded,
          altKey   : altKeyNeeded,
          ctrlKey  : ctrlKeyNeeded
        },
        function (settings) {
            if (settings) {
                shiftKeyNeeded = settings.shiftKey;
                altKeyNeeded   = settings.altKey;
                ctrlKeyNeeded  = settings.ctrlKey;
                metaKeyNeeded  = settings.metaKey;
            } else {
                console.error(
                    'Key-ncognito extension: (', chrome.runtine.id, '): ',
                    chrome.runtime.lastError,
                    ' while retrieving settings.'
                );
            }
        }
    );

    return function (ev) {
        if ((ev.altKey   === altKeyNeeded)   &&
            (ev.metaKey  === metaKeyNeeded)  &&
            (ev.shiftKey === shiftKeyNeeded) &&
            (ev.ctrlKey  === ctrlKeyNeeded)  &&
            !ev.defaultPrevented
            ) {

            var targetElement = ev.target;
            while(targetElement !== null && targetElement.nodeName.toUpperCase() !== "A") {
                targetElement = targetElement.parentElement;
            }

            // Proceed only if an A element was found in the ev.target's ancestry
            if (targetElement !== null) {
                ev.preventDefault();
                chrome.extension.sendMessage(
                    { url: targetElement.href },
                    function(resp) {
                        if (resp) {
                            console.log('Opened URL: ', targetElement.href, ' in a new incognito window.');
                        } else {
                            console.error('Failed to open the URL: ', targetElement.href);
                        }
                    }
                );
            }
        }
    };
}
