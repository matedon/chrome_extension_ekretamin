/*!
 * Required:
 * https://github.com/pie6k/jquery.initialize/blob/master/LICENSE
 */

let obs = [] // array for $.initialize.disconnect
const fnObsDisconnect = function () {
  $.each(obs, function (i, o) {
    o.disconnect()
  })
  obs = []
}
const fnObsRow = function(sel, fn, delay) {
  // console.log('fnObsRow call', sel)
  if (typeof delay === typeof void 0) {
    delay = 300
  }
  obs.push($.initialize(sel, function () {
    const self = this
    // console.log('fnObsRow init', sel)
    setTimeout(function () {
      // console.log('fnObsRow run', sel)
      fn.call(self)
    }, delay)
  }))
}

/**
 * Variables common in bridge.js and foreground.js
 */
const sn = {
  cs: {},
  id: {}
}
/**
 * swVersion variable comes from foreground.js $().ready()
 */
sn.cs.Base = swVersion
sn.cs.Tb = sn.cs.Base + '-toolbar'
sn.id.TbCont = sn.cs.Base + '-toolbar-cont'
sn.id.TbStyle = sn.cs.Base + '-toolbar-style'
sn.id.Min = sn.cs.Base + '-style-min'
sn.id.Bridge = sn.cs.Base + '-style-bridge'
sn.id.setHereBtn = sn.cs.Base + '-set-here-btn'
sn.id.setHereAll = sn.cs.Base + '-set-here-all'
sn.id.setFilterKeep = sn.cs.Base + '-set-filter-keep'
/**
 * Variables in bridge.js
 */
sn.cs.TbRow = sn.cs.Tb + '-row'
sn.cs.TbClr = sn.cs.Tb + '-btn-clr'
sn.cs.TbDel = sn.cs.Tb + '-btn-del'
sn.cs.TbStop = sn.cs.Tb + '-btn-stop'
sn.cs.TbClose = sn.cs.Tb + '-btn-close'
sn.cs.TbBtnAct = sn.cs.Tb + '-btn-active'
sn.cs.TbNap = sn.cs.Tb + '-btn-nap'
sn.cs.TbDev = sn.cs.Tb + '-btn-dev'
sn.cs.TbFil = sn.cs.Tb + '-filter'
sn.cs.TbNth = sn.cs.Tb + '-nth'
sn.cs.TbFind = sn.cs.Tb + '-find'
sn.cs.TbTop = sn.cs.Base + '-topic'
sn.cs.TbPres = sn.cs.Base + '-presence'
sn.cs.TbDone = sn.cs.Base + '-done'
sn.cs.TbVal = sn.cs.Tb + '-kij'
sn.cs.TbDay = sn.cs.Tb + '-day'
sn.cs.TbDays = sn.cs.Tb + '-days'
sn.cs.Cell = sn.cs.Base + '-cell'

const findFilterStack = []

let brigeDATA = {}
const fnGetBridgeData = function () {
  try {
    let brigeDATA_a = JSON.parse($('#' + swVersion).html())
    let brigeDATA_b = JSON.parse(localStorage.getItem(swVersion))
    
    if (!brigeDATA_a) {
      brigeDATA_a = {}
    }
    if (!brigeDATA_b) {
      brigeDATA_b = {}
    }
    brigeDATA = $.extend(true, {}, brigeDATA_a, brigeDATA_b)
  } catch (e) {
    brigeDATA = {}
  }
  console.log('brigeDATA', brigeDATA)
}
$.initialize('#' + swVersion, function () {
  fnGetBridgeData()
  console.log('#' + swVersion + ' brigeDATA set', brigeDATA)
  $(this).remove()
})

const fnFilterKeep = function () {
  const loc = window.location.pathname
  console.log('loc', loc)
  if (brigeDATA.setFilterKeep.urls == undefined || brigeDATA.setFilterKeep.urls[loc] == undefined) {
    return false
  }
  let submitTime
  $.each(brigeDATA.setFilterKeep.urls[loc], function (i, ko) {
    if (ko.att == undefined) {
      ko.att = 'text'
    }
    if (ko.evt == undefined) {
      ko.evt = 'click'
    }
    $body.on(ko.evt + '.' + sn.id.setFilterKeep, ko.sel, function () {
      const $th = $(this)
      ko.val = $th.text()
      localStorage.setItem(swVersion, JSON.stringify(brigeDATA))
    })
    const ino = $.initialize(ko.sel, function () {
      const $th = $(this)
      if (ko.val && ko.val == $th.text()) {
        $th.trigger(ko.evt)
        clearTimeout(submitTime)
        submitTime = setTimeout(function () {
          ino.disconnect()
          console.log('submitTime SUBMIT')
          $('#searchPanelBtn').trigger('click')
        }, 300)
      }
    })
  })
}

const $body = $('body')
const fnToolbar = function () {
  $body.on('click', '.' + sn.cs.TbStop, function () {
    findFilterStack.length = 0
    fnObsDisconnect()
  })
  $body.on('click', '.' + sn.cs.TbDays, function () {
    $(this).toggleClass(sn.cs.TbBtnAct)
  })
  $body.on('click', '.' + sn.cs.TbClr, function () {
    $(this).closest('.' + sn.cs.Tb).find(':input').val('')
    $(this).closest('.' + sn.cs.Tb).find('.' + sn.cs.TbDays).removeClass(sn.cs.TbBtnAct)
    $('.fc-time-grid-event').removeClass(sn.cs.Cell)
  })
  $body.on('click', '.' + sn.cs.TbFind, function () {
    const $btn = $(this)
    $(this).closest('.' + sn.cs.Tb).find('button').removeClass(sn.cs.Cell)
    $btn.addClass(sn.cs.Cell)
    findFilterOra()
  })
  $body.on('click', '.' + sn.cs.TbDel, function () {
    const $btn = $(this)
    $(this).closest('.' + sn.cs.Tb).find('button').removeClass(sn.cs.Cell)
    $btn.addClass(sn.cs.Cell)
    if (confirm('Delete ' + $('.fc-time-grid-event.' + sn.cs.Cell).length + '?')) {
      delNextOra()
    }
  })
  $body.on('click', '.' + sn.cs.TbNap, function () {
    const $btn = $(this)
    $(this).closest('.' + sn.cs.Tb).find('button').removeClass(sn.cs.Cell)
    $btn.addClass(sn.cs.Cell)
    if (confirm('Naplóz ' + findFilterOra().length + '?')) {
      napNextOra()
    }
  })
  $body.on('click', '.' + sn.cs.TbStop, function () {
    const $btn = $(this)
    $('.fc-time-grid-event').removeClass(sn.cs.Cell)
    $(this).closest('.' + sn.cs.Tb).find('button').removeClass(sn.cs.Cell)
    $btn.addClass(sn.cs.Cell)
  })
  $body.on('click', '.' + sn.cs.TbClose, function () {
    $('.' + sn.cs.Tb).remove()
    $('#' + sn.id.TbStyle).remove()
    $('.fc-time-grid-event').removeClass(sn.cs.Cell)
  })
  $body.on('click', '.' + sn.cs.TbDev, function () {
    // delNextOra()

    console.log($('#' + swVersion).html())
  })
}
$().ready(function () {
  $.initialize('.' + sn.cs.TbRow, function () {
    const $row = $(this)
    const rowData = $row.data()
    if (rowData && rowData.urlMatch) {
      const matches = rowData.urlMatch.split(' ')
      const results = []
      $.each(matches, function (i, patt) {
        const regex = patt.replace(/\*/g, "[^ ]*");
        const match = (window.location.href).match(regex) ? true : false
        results.push(match)
      })
      if (results.indexOf(true) == 0) {
        $row.removeClass(swVersion + '-hidden')
      }
    }
  })
  fnToolbar()

  if ($('#' + sn.id.setFilterKeep).length) {
    const time = setTimeout(fnFilterKeep, 500)
  }
})

$.initialize('.mulasztasGridColumnHeaderJelen', function () {
  if ($('#' + sn.id.setHereBtn).length == 0) return false
  const $th = $(this)
  const $tp = $th.parent()
  const $mn = $tp.closest('#MulasztasokNaplozasaGrid')
  $tp.find('.mulasztasGridColumnHeader').addClass(swVersion + '-mulasztasGridColumnHeader')
  $tp.find('.mulasztasGridColumnHeaderJelen').text('Jelen').css('width', 'auto')
  $tp.find('.mulasztasGridColumnHeaderUres').text('Üres').css('width', 'auto')
  const $sm = $('<div>Okos</div>')
  .addClass('mulasztasGridColumnHeader')
  .addClass(swVersion + '-mulasztasGridColumnHeader')
  .addClass(swVersion + '-mulasztasGridColumnHeader-smart')
  .on('click.' + swVersion, function () {
    $mn
    .find('[data-inputparentgrid="MulasztasokNaplozasaGrid"]')
    .each(function () {
      const $self = $(this)
      const $act = $self.find('.activebar')
      if ($act.length == 0) {
        $self.find('li[val=1498]').trigger('click')
      }
    })
  })
  .appendTo($tp)
  let time
  if ($('#' + sn.id.setHereAll).length) {
    $.initialize('[data-inputparentgrid="MulasztasokNaplozasaGrid"]', function () {
      clearTimeout(time)
      time = setTimeout(function () {
        $sm.trigger('click.' + swVersion)
      }, 300)
    })
  }
})


const findFilterOra = function () {
  findFilterStack.length = 0
  let $mindenOra = $('body').find('.fc-title').closest('.fc-time-grid-event')
  $mindenOra.removeClass(sn.cs.Cell)
  let dayNums = []
  $('.' + sn.cs.TbDays).each(function (nth) {
    if ($(this).hasClass(sn.cs.TbBtnAct)) {
      dayNums.push(nth)
    }
  })
  let fil = $('.' + sn.cs.TbFil).val().toLowerCase()
  const nthVal = $('.' + sn.cs.TbNth).val()
  let nth = nthVal.length ? nthVal.split(',') : []
  const noTema = $('.' + sn.cs.TbDone).val()[0]
  const $orak = $mindenOra.filter(function () {
    const $ora = $(this)
    const oraData = $ora.data()
    let ret = []
    if (oraData.fcSeg.start && dayNums && dayNums.length) {
    const dayStart = (new Date(oraData.fcSeg.start)).getDay() - 1
    if (dayNums.indexOf(dayStart) > -1) {
      ret[0] = true
    } else {
      ret[0] = false
    }
    } else {
      ret[0] = true
    }
    if (fil.length) {
      if ($ora.text().toLowerCase().includes(fil)) {
        ret[1] = true
      } else {
        ret[1] = false
      }
    } else {
      ret[1] = true
    }
    if (nth.length) {
      if (nth.includes(oraData.fcSeg.event.hanyadikora + '')) {
        ret[2] = true
      } else {
        ret[2] = false
      }
    } else {
      ret[2] = true
    }
    if (noTema && noTema.length) {
      if ((noTema == '0' && oraData.fcSeg.event.colorEnum == 6) ||
        (noTema == '1' && oraData.fcSeg.event.colorEnum == 9)) {
        ret[3] = true
      } else {
        ret[3] = false
      }
    } else {
      ret[3] = true
    }
    let ret_all = true
    $.each(ret, function (k, rr) {
      ret_all = ret_all && rr
    })
    if (ret_all) {
      findFilterStack.push(oraData.fcSeg.event.id)
    }
    return ret_all
  })
  console.log(findFilterStack)
  return $orak.addClass(sn.cs.Cell)
}

$.initialize('.fc-time-grid', function () {
  console.log("initialize fc-time-grid")
})

let timeFcTitle = setTimeout(function () {}, 0)
let fnFcTitleReady = function () {}
$.initialize('.fc-title', function () {
  console.log("initialize fc-title")
  clearTimeout(timeFcTitle)
  timeFcTitle = setTimeout(function () {
    console.log('timeFcTitle fire')
    fnFcTitleReady()
  }, 1000)
})

const delNextOra = function () {
  fnObsDisconnect()
  if (findFilterStack.length == 0) {
    $('.' + sn.cs.TbStop).trigger('click')
    return false
  }
  if ($('.' + sn.cs.TbStop).hasClass(sn.cs.Cell)) {
    return false
  }
  const fsId = findFilterStack.shift()
  $('.' + sn.cs.TbVal).val(findFilterStack.length)
  const $idOra = $('.fc-time-grid-event').filter(function () {
    return $(this).data().fcSeg.event.id == fsId
  })
  if (!$idOra.length) {
    return false
  }
  fnObsRow('#modOrarendiOraDeleteDay', function () {
    fnObsRow('.closeYesConfirm', function () {
      fnFcTitleReady = function () {
        console.log('delNextOra')
        delNextOra()
      }
      $(this).trigger('click')
    })
    $(this).trigger('click')
  })

  $idOra.trigger('click')
}
const napNextOra = function () {
  fnObsDisconnect()
  if (findFilterStack.length == 0) {
    $('.' + sn.cs.TbStop).trigger('click')
    return false
  }
  if ($('.' + sn.cs.TbStop).hasClass(sn.cs.Cell)) {
    return false
  }
  const fsId = findFilterStack.shift()
  $('.' + sn.cs.TbVal).val(findFilterStack.length)
  const $idOra = $('.fc-time-grid-event').filter(function () {
    return $(this).data().fcSeg.event.id == fsId
  })
  if (!$idOra.length) {
    return false
  }
  fnObsRow('#MulasztasokNaplozasaGrid', function () {
    const $grid = $(this)
    const $dial = $grid.closest('#tanoraMuveletWindow')
    $dial
      .find('[name="Tema_input"]')
      .trigger('focusin')
      .val($('.' + sn.cs.TbTop).val())
      .trigger('keyup')
      .trigger('focusout')
    // console.log('#tanoraMuveletWindow', $('.' + sn.cs.TbPres).val()[0], $dial.find('#MulasztasokNaplozasaGrid'))
    if ($('.' + sn.cs.TbPres).val()[0] == '1') {
      $grid.find('.mulasztasGridColumnHeaderJelen').trigger('click')
    }
    if ($('.' + sn.cs.TbPres).val()[0] == '2') {
      $grid
        .find('[data-inputparentgrid="MulasztasokNaplozasaGrid"]')
        .each(function () {
          const $self = $(this)
          const $act = $self.find('.activebar')
          if ($act.length == 0) {
            $self.find('li[val=1498]').trigger('click')
          }
        })
    }
    let submitTimer = setTimeout(function () {
      $dial.find('#naplozas').trigger('click')
    }, 1000)
    fnFcTitleReady = function () {
      console.log('napNextOra')
      napNextOra()
    }
  })
  $idOra.trigger('click')
}