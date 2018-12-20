$('#mini-nav').click(function (e) {
  // $('#mini-nav-wrapper').removeClass('hidden')
  // $('#nav-mobile').animate({ right: 0 }, 1, 'linear')
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

$(window).scroll(function () {
  // console.log(window.scrollY)
  if (window.scrollY >= 420) {
    $('#mini-nav').addClass('mod')
  } else {
    $('#mini-nav').removeClass('mod')
  }
})
