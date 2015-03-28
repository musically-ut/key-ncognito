var body = document.getElementsByTagName('body')[0];
body.addEventListener('click', function (ev) {
    if (ev.altKey && ev.metaKey && ev.target.nodeName.toUpperCase() === "A") {
        ev.preventDefault();
        chrome.extension.sendMessage(
            { url: ev.target.href }
          , function(resp) {
                if (resp) {
                    console.log('Opened URL: ', ev.target.href, ' in a new incognito window.');
                } else {
                    console.error('Failed to open the URL: ', ev.target.href);
                }
            }
        );
    }
});
