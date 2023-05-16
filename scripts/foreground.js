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
      $('body').append('<script>' + res + '</script>')
    }
  })
  $.get({
    'url' : chrome.runtime.getURL('inject/bridge.js'),
    'success' : function (res) {
      $('body').append('<script>' + res + '</script>')
    }
  })
})

const sn = {
  cs: {},
  id: {}
}
sn.cs.Base = swVersion
sn.cs.Tb = sn.cs.Base + '-toolbar'
sn.id.Style = sn.cs.Base + '-style'
sn.id.Min = sn.cs.Base + '-style-min'
sn.id.setHereBtn = sn.cs.Base + '-set-here-btn'

fnModSet = function (sett) {
  if (sett == null || sett == undefined) {
    sett = {}
  }
  if (sett && sett.setToolbar) {
    $.ajax({
      'method' : 'GET',
      'dataType' : 'html',
      'url' : chrome.runtime.getURL('inject/inject.html'),
      'success' : function (res) {
        $('.' + sn.cs.Tb).remove()
        $('body').append(res.replaceAll('swVersion', swVersion))
      }
    })
    $.ajax({
      'method' : 'GET',
      'url' : chrome.runtime.getURL('inject/inject.css'),
      'success' : function (res) {
        $('#' + sn.id.Style).remove()
        $('body').append('<style id="' + sn.id.Style + '">' + res.replaceAll('swVersion', swVersion) + '</style>')
        // fnToolbar()
      }
    })
  } else {
    $('.' + sn.cs.Tb).remove()
    $('#' + sn.id.Style).remove()
  }
  if (sett && sett.setCssPro) {
    $.ajax({
      'method' : 'GET',
      'url' : chrome.runtime.getURL('inject/min.css'),
      'success' : function (res) {
        $('#' + sn.id.Min).remove()
        $('body').append('<style id="' + sn.id.Min + '">' + res + '</style>')
      }
    })
  } else {
    $('#' + sn.id.Min).remove()
  }

  if (sett && sett.setHereBtn) {
    $('#' + sn.id.setHereBtn).remove()
    $('body').append('<script id="' + sn.id.setHereBtn + '"></script>')
  } else {
    $('#' + sn.id.setHereBtn).remove()
  }
}