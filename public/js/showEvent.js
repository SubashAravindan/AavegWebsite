$('#deleteBtn').on('click', () => {
  swal({
    title: 'Are you sure?',
    text: `Do you want to delete the event ${$('#eventName').text()} ?`,
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then((toDelete) => {
    console.log($('.adminControls a').attr('href').slice(18))
    if (toDelete) {
      $.ajax({
        url: `admin/events/${$('.adminControls a').attr('href').slice(18)}`,
        type: 'DELETE',
        success: function (result) {
          swal({
            text: 'You have deleted the event',
            icon: 'success'
          }).then(() => {
            window.location.href = 'events'
          })
        },
        failure: function (data) {
          swal({
            title: 'Delete failed',
            text: data.responseText,
            icon: 'error'
          })
        }
      })
    }
  })
})

$(function () {
  $('.description').scrollex({
    enter: function () {
      $('.winners').slideDown(1500)
    }
  })
})
