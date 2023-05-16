const colog = function (dt) {
    // https://stackoverflow.com/a/75789301
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            message: "console_log",
            // data: arguments.length == 1 ? arguments[0] : arguments,
            data: dt
        })
    })
}
const swVersion = 'eKretaMinSett_' + chrome.runtime.getManifest().version
chrome.storage.local.get(swVersion, function (sett) {
    colog([swVersion, sett])
    if (sett == null || sett == undefined) {
        fnDone()
    } else {
        fnDone(sett[swVersion])
    }
})

const fnDone = function (sett) {
    if (sett == null || sett == undefined) {
        sett = {}
    }
    colog(['fnDone', 'sett', sett])
    const fnModSet = function (key, val) {
        let options = {}
        if (typeof key == 'object') {
            options = key
        }
        if (typeof key == 'string') {
            options[key] = val
        }
        sett = $.extend(true, sett, options)
        colog(['fnModSet extend', key, val, sett])
        const store = {}
        store[swVersion] = sett
        // colog(store)
        chrome.storage.local.set(store, function () {
            chrome.storage.local.get(swVersion, function (mdg) {
                colog(['fnModSet & get', swVersion, mdg])
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        message: "fnModSet",
                        data: mdg[swVersion]
                    })
                })
            })
        })
    }

    $('.sett-line').find('input')
        .each(function () {
            const $th = $(this)
            const id = $th.attr('id')
            colog([id, sett[id]])
            $th.prop('checked', sett[id])
        })
        .on('change', function () {
            const $th = $(this)
            const id = $th.attr('id')
            if ($th.attr('type') == 'checkbox') {
                const ch = $(this).is(':checked')
                fnModSet(id, ch)
            }
        })
}