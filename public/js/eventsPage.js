$('.clusterText').click(function () {
  const clusterIndex = $('.clusterText').index($(this))
  if (window.screen.width > 700 || $($('.clusterContainer')[clusterIndex]).is(':active')) {
    $('.eventsList').addClass('hide')
    $('.clusterRow').fadeOut(400, () => {
      $($('.eventsList')[clusterIndex]).slideDown(400, () => {
        $('#backBtn').fadeIn()
      })
    })
  }
})
$('#backBtn').click(function () {
  $('.eventsList:visible').slideUp(400, () => {
    $('.clusterRow').fadeIn(800)
    $('#backBtn').fadeOut()
  })
})
