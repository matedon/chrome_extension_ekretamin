const swVersion = 'eKretaMinSett_' + chrome.runtime.getManifest().version.replaceAll('.', '')
console.log(swVersion + ' init')
chrome.storage.local.get(swVersion, function (sett) {
  console.log(swVersion, sett)
  if (sett == null || sett == undefined) {
    console.log(swVersion, 'chrome.storage.local.get EMPTY')
  }
  fnModSet(sett[swVersion])
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "console_log") {
    console.log(request.data)
  }
  if (request.message == "fnModSet") {
    console.log(request.message, request.data)
    fnModSet(request.data)
  }
})

$().ready(function () {
  console.log(swVersion + ' document ready')
  $('body').append('<script>const swVersion = "' + swVersion + '"</script>')
  $.get({
    'url' : chrome.runtime.getURL('inject/jquery.initalize.js'),
    'success' : function (res) {
      $('body').append('<script>' + res + '</script>'),
      $.get({
        'url' : chrome.runtime.getURL('inject/bridge.js'),
        'success' : function (res) {
          $('body').append('<script>' + res + '</script>')
        }
      })
    }
  })
})

/**
 * Variables common in bridge.js and foreground.js
 */
const sn = {
  cs: {},
  id: {}
}
sn.cs.Base = swVersion
sn.cs.Tb = sn.cs.Base + '-toolbar'
sn.id.TbCont = sn.cs.Base + '-toolbar-cont'
sn.id.TbStyle = sn.cs.Base + '-toolbar-style'
sn.id.Min = sn.cs.Base + '-style-min'
sn.id.Bridge = sn.cs.Base + '-style-bridge'
sn.id.setHereBtn = sn.cs.Base + '-set-here-btn'
sn.id.setHereAll = sn.cs.Base + '-set-here-all'
sn.id.setFilterKeep = sn.cs.Base + '-set-filter-keep'

fnModSet = function (sett) {
  console.log('foreground.js fnModSet', sett)
  if (sett == null || sett == undefined) {
    sett = {}
  }
  $('#' + swVersion).remove()
  $('body').append('<div id="' + swVersion + '">' + JSON.stringify(sett) + '</div>')
  if ($('#' + sn.id.Bridge).length == 0) {
    $.ajax({
      'method' : 'GET',
      'url' : chrome.runtime.getURL('inject/bridge.css'),
      'success' : function (res) {
        $('#' + sn.id.Bridge).remove()
        $('body').append('<style id="' + sn.id.Bridge + '">' + res.replaceAll('swVersion', swVersion) + '</style>')
      }
    })
  }
  if (sett && sett.setToolbar && sett.setToolbar.active) {
    if ($('#' + sn.id.TbCont).length == 0) {
      $.ajax({
        'method' : 'GET',
        'dataType' : 'html',
        'url' : chrome.runtime.getURL('inject/toolbar.html'),
        'success' : function (res) {
          $('#' + sn.id.TbCont).remove()
          $('body').append('<div id="' + sn.id.TbCont + '">' + res.replaceAll('swVersion', swVersion) + '</div>')
        }
      })
    }
    if ($('#' + sn.id.TbStyle).length == 0) {
      $.ajax({
        'method' : 'GET',
        'url' : chrome.runtime.getURL('inject/toolbar.css'),
        'success' : function (res) {
          $('#' + sn.id.TbStyle).remove()
          $('body').append('<style id="' + sn.id.TbStyle + '">' + res.replaceAll('swVersion', swVersion) + '</style>')
        }
      })
    }
  } else {
    $('#' + sn.id.TbCont).remove()
    $('#' + sn.id.TbStyle).remove()
  }
  if (sett && sett.setCssPro && sett.setCssPro.active) {
    if ($('#' + sn.id.Min).length == 0) {
      $.ajax({
        'method' : 'GET',
        'url' : chrome.runtime.getURL('inject/min.css'),
        'success' : function (res) {
          $('#' + sn.id.Min).remove()
          $('body').append('<style id="' + sn.id.Min + '">' + res + '</style>')
        }
      })
    }
  } else {
    $('#' + sn.id.Min).remove()
  }
  $(['setHereBtn', 'setFilterKeep', 'setHereAll']).each(function (i, key) {
    $('#' + sn.id[key]).remove()
    if (sett && sett[key] && sett[key].active) {
      $('body').append('<script id="' + sn.id[key] + '"></script>')
    }
  })
}