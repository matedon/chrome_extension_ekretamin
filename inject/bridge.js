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

const sn = {
    cs: {},
    id: {}
}
sn.cs.Base = swVersion
sn.cs.Tb = sn.cs.Base + '-toolbar'
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
sn.id.Style = sn.cs.Base + '-style'
sn.id.Min = sn.cs.Base + '-style-min'

let $snip = $()
const fnToolbar = function () {
    $snip = $('.' + sn.cs.Tb)
    $snip.find('.' + sn.cs.TbStop).on('click', function () {
        fnObsDisconnect()
    })
    $snip.find('.' + sn.cs.TbDays).on('click', function () {
        $(this).toggleClass(sn.cs.TbBtnAct)
    })
    $snip.find('.' + sn.cs.TbClr).on('click', function () {
        $snip.find(':input').val('')
        $snip.find('.' + sn.cs.TbDays).removeClass(sn.cs.TbBtnAct)
        $('.fc-time-grid-event').removeClass(sn.cs.Cell)
    }).trigger('click')
    $snip.find('.' + sn.cs.TbFind).on('click', function () {
        const $btn = $(this)
        $snip.find('button').removeClass(sn.cs.Cell)
        $btn.addClass(sn.cs.Cell)
        findFilterOra()
    })
    $snip.find('.' + sn.cs.TbDel).on('click', function () {
        const $btn = $(this)
        $snip.find('button').removeClass(sn.cs.Cell)
        $btn.addClass(sn.cs.Cell)
        if (confirm('Delete ' + $('.fc-time-grid-event.' + sn.cs.Cell).length + '?')) {
        delNextOra()
        }
    })
    $snip.find('.' + sn.cs.TbNap).on('click', function () {
        const $btn = $(this)
        $snip.find('button').removeClass(sn.cs.Cell)
        $btn.addClass(sn.cs.Cell)
        if (confirm('Naplóz ' + findFilterOra().length + '?')) {
        napNextOra()
        }
    })
    $snip.find('.' + sn.cs.TbStop).on('click', function () {
        const $btn = $(this)
        $('.fc-time-grid-event').removeClass(sn.cs.Cell)
        $snip.find('button').removeClass(sn.cs.Cell)
        $btn.addClass(sn.cs.Cell)
    })
    $snip.find('.' + sn.cs.TbClose).on('click', function () {
        $('.' + sn.cs.Tb).remove()
        $('#' + sn.id.Style).remove()
        $('.fc-time-grid-event').removeClass(sn.cs.Cell)
    })
    $snip.find('.' + sn.cs.TbDev).on('click', function () {
      
    })
}
fnToolbar()

const findFilterOra = function () {
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
      return ret_all
    })
    return $orak.addClass(sn.cs.Cell)
  }
  const delNextOra = function () {
    const $orak = findFilterOra()
    if ($orak.length == 0) {
      $snip.find('.' + sn.cs.TbStop).trigger('click')
      return false
    }
    if ($snip.find('.' + sn.cs.TbStop).hasClass(sn.cs.Cell)) {
      return false
    }
    $snip.find('.' + sn.cs.TbVal).val($orak.length)
    const fctLen = $('.fc-title').length
    fnObsDisconnect()
    fnObsRow('#modOrarendiOraDeleteDay', function () {
      fnObsRow('.closeYesConfirm', function () {
        let iter = setInterval(function () {
          if ($('.fc-title').length == fctLen - 1) {
            clearInterval(iter)
            fnObsDisconnect()
            delNextOra()
          }
        }, 300)
        $(this).trigger('click')
      })
      $(this).trigger('click')
    })
    $orak.eq(0).trigger('click')
  }
  const napNextOra = function () {
    const $orak = findFilterOra()
    if ($orak.length == 0) {
      $snip.find('.' + sn.cs.TbStop).trigger('click')
      return false
    }
    if ($snip.find('.' + sn.cs.TbStop).hasClass(sn.cs.Cell)) {
      return false
    }
    $snip.find('.' + sn.cs.TbVal).val($orak.length)
    const fctLen = $orak.length
    fnObsDisconnect()
    fnObsRow('#tanoraMuveletWindow', function () {
      $dial = $(this)
      $dial.find('[name="Tema_input"]')
        .trigger('focusin')
        .val($('.' + sn.cs.TbTop).val())
        .trigger('keyup')
        .trigger('focusout')
      if ($snip.find('.' + sn.cs.TbPres).val()[0] == '1') {
        $dial.find('.mulasztasGridColumnHeaderJelen').trigger('click')
      }
      if ($snip.find('.' + sn.cs.TbPres).val()[0] == '2') {
        $dial.find('[data-inputparentgrid="MulasztasokNaplozasaGrid"]').each(function () {
          const $self = $(this)
          const $act = $self.find('.activebar')
          if ($act.length == 0) {
            $self.find('li[val=1498]').trigger('click')
          }
        })
      }
      let submitTimer = setTimeout(function () {
        $dial.find('#naplozas').trigger('click')
      }, 200)
      let iter = setInterval(function () {
        if (findFilterOra().length == fctLen - 1) {
          clearInterval(iter)
          fnObsDisconnect()
          napNextOra()
        }
      }, 300)
    })
    $orak.eq(0).trigger('click')
  }