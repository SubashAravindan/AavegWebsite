$('#mini-nav').click(function (e) {
  $('#mini-nav-wrapper').fadeIn(500).slideDown(100)
})

$('#nav-mob-close').click(function (e) {
  $('#mini-nav-wrapper').fadeOut(500)
})

$(window).click(function (e) {
  if (e.target === $('#mini-nav-wrapper').get(0)) {
    $('#mini-nav-wrapper').fadeOut(500)
  }
})

$(document).ready(function () {
  $('#JPO').popup({
    transition: 'all 0.3s'
  })
  $.fn.popup.defaults.pagecontainer = '#wrapper'
})

$(window).scroll(function () {
  if (window.scrollY >= 420) {
    $('#mini-nav').addClass('mod')
  } else {
    $('#mini-nav').removeClass('mod')
  }
})
