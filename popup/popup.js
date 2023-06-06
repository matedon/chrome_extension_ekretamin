const wildcardCheck = function(url, pattern) {
  if (!url || !pattern) return false
  // Source: https://stackoverflow.com/a/51712612/1516015
  const regExpEscape = function(s) {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  }
  var patt = new RegExp('^' + pattern.split(/\*+/).map(regExpEscape).join('.*') + '$')
  return url.match(patt) !== null && url.match(patt).length >= 1
}

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
const swVersion = 'eKretaMinSett_' + chrome.runtime.getManifest().version.replaceAll('.', '')
chrome.storage.local.get(swVersion, function (sett) {
  colog([swVersion, sett])
  if (sett[swVersion] == null || sett[swVersion] == undefined) {
    sett[swVersion] = {}
  }
  $.ajax({
    'method' : 'GET',
    'dataType' : 'json',
    'url' : chrome.runtime.getURL('metrics.json'),
    'success' : function (res) {
      const setex = $.extend(true, {}, res, sett[swVersion])
      colog(['metrics.json', res, setex])
      fnDone(setex)
    }
  })
})

const fnDone = function (sett) {
  if (sett == null || sett == undefined) {
    sett = {}
  }
  colog(['fnDone', 'sett', sett])
  const fnModSet = function (key, val) {
    if (typeof key !== 'string') {
      return false
    }
    let options = {}
    options[key] = {
      'active': val
    }
    sett = $.extend(true, {}, sett, options)
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

  const fnPopup = function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let url = tabs[0].url.replace('http://', '').replace('https://', '')
      const locationPathname = '/' + url.split(/\/(.*)/s)[1]
      
      $('[data-mod]').each(function () {
        const $mod = $(this)
        const mod = $mod.data('mod')
        colog([mod, sett[mod]])
        $mod.find('[data-mod-input]').prop('checked', sett[mod].active)
        $mod.find('[data-mod-url]').html('<ul><li>' + Object.keys(sett[mod].urls).join('</li><li>') + '</li></ul>')
      })
      .find('[data-mod-input]').on('change', function () {
        const $th = $(this)
        const $mod = $th.closest('[data-mod]')
        const mod = $mod.data('mod')
        if ($th.attr('type') == 'checkbox') {
          const ch = $th.is(':checked')
          fnModSet(mod, ch)
        }
      })
      .trigger('change')
      $('[data-mod-url]').find('li').each(function () {
        let pattern = $(this).text()
        if (wildcardCheck(locationPathname, pattern)) {
          $(this).addClass('active')
        }
      })
    })

    
  }
  fnPopup()
}