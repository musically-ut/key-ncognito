$(function () {

function bindTestLink() {
    $('.test-config')
        .off('click.key-ncognito')
        .on('click.key-ncognito', keyncognitoHandler());
}

bindTestLink();

function saveSettings() {
    var altKeySetting   = $('.ui.checkbox.alt').checkbox('is checked');
    var shiftKeySetting = $('.ui.checkbox.shift').checkbox('is checked');
    var metaKeySetting  = $('.ui.checkbox.meta').checkbox('is checked');
    var ctrlKeySetting  = $('.ui.checkbox.ctrl').checkbox('is checked');

    chrome.storage.sync.set(
        { altKey   : altKeySetting,
          shiftKey : shiftKeySetting,
          metaKey  : metaKeySetting,
          ctrlKey  : ctrlKeySetting
        },
        function () {
            bindTestLink();
            if (chrome.runtime.lastError) {
                console.error(
                    'Key-ngcognito (' + chrome.runtime.id + ') :',
                    chrome.runtime.lastError,
                    ' while trying to save settings.'
                );
            }
        }
    );
}

function behavior() {
    function enableElem($elem) {
        $elem.removeClass('disabled')
             .addClass('positive');
    }

    function disableElem($elem) {
        $elem.removeClass('positive')
             .addClass('disabled');
    }

    chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
        if (isAllowedAccess) {
            enableElem($('.reuse-window'));
            disableElem($('.new-window'));
        } else {
            enableElem($('.new-window'));
            disableElem($('.reuse-window'));
        }
    });
}

behavior();

$('.extension-link').on('click', function () {
    chrome.tabs.create({
        url: 'chrome://extensions/?id=' + chrome.runtime.id
    });
});

var altKeyNeeded   = true,
    shiftKeyNeeded = false,
    metaKeyNeeded  = true,
    ctrlKeyNeeded  = false;

chrome.storage.sync.get(
    { altKey   : altKeyNeeded,
      shiftKey : shiftKeyNeeded,
      metaKey  : metaKeyNeeded,
      ctrlKey  : ctrlKeyNeeded
    },
    function (settings) {
        if (settings) {
            altKeyNeeded   = settings.altKey;
            shiftKeyNeeded = settings.shiftKey;
            metaKeyNeeded  = settings.metaKey;
            ctrlKeyNeeded  = settings.ctrlKey;

            $('.ui.checkbox.alt'  ).checkbox(altKeyNeeded   ? 'check' : 'uncheck');
            $('.ui.checkbox.shift').checkbox(shiftKeyNeeded ? 'check' : 'uncheck');
            $('.ui.checkbox.meta' ).checkbox(metaKeyNeeded  ? 'check' : 'uncheck');
            $('.ui.checkbox.ctrl' ).checkbox(ctrlKeyNeeded  ? 'check' : 'uncheck');

            $('.ui.checkbox').checkbox({
                onChange: saveSettings
            });
        } else {
            console.error(
                'Key-ncognito extension: (', chrome.runtine.id, '): ',
                chrome.runtime.lastError,
                ' while retrieving settings.'
            );
        }
    });
});
