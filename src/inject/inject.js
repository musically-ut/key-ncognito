var body = document.getElementsByTagName('body')[0];
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
                'Key-ncognito extension: (', chrom.runtine.id, '): ',
                chrome.runtime.lastError,
                ' while retrieving settings.'
            );
        }
    });

body.addEventListener('click', function (ev) {
    if ((ev.altKey   === altKeyNeeded)   &&
        (ev.metaKey  === metaKeyNeeded)  &&
        (ev.shiftKey === shiftKeyNeeded) &&
        (ev.ctrlKey  === ctrlKeyNeeded)  &&
        ev.target.nodeName.toUpperCase() === "A") {
        ev.preventDefault();
        chrome.extension.sendMessage(
            { url: ev.target.href },
            function(resp) {
                if (resp) {
                    console.log('Opened URL: ', ev.target.href, ' in a new incognito window.');
                } else {
                    console.error('Failed to open the URL: ', ev.target.href);
                }
            }
        );
    }
});
