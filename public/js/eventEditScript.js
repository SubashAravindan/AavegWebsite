$(document).ready(function () {
  var url = window.location.href
  var prizeCounter = 3
  $(document).on('click', '#addPoints', () => {
    document.getElementById('wrapdiv').innerHTML = document.getElementById('wrapdiv').innerHTML +
    ('<label for="points' + prizeCounter +
    '">Points for Winner ' + prizeCounter +
    ': </label><input type="number" id="points' + prizeCounter +
    '" name="points' + prizeCounter + '">')
    prizeCounter = prizeCounter + 1
  })
  $(document).on('click', '#submitCreate', () => {
    const ID = url.split('/')[url.split('/').length - 1]
    var points = []
    for (var i = 1; i <= prizeCounter; i++) { points.push($('#points' + i.toString()).val()) }
    const formData = {
      'name': $('#eventName').val(),
      'cluster': $('#cluster').val(),
      'cup': $('#cup').val(),
      'points': points,
      'places': prizeCounter,
      'venue': $('#venue').val(),
      'description': $('#description').val(),
      'rules': $('#rules').val(),
      'date': $('#date').val(),
      'startTime': $('#startTime').val(),
      'endTime': $('#endTime').val()
    }
    $.ajax({
      url: '/admin/events/' + ID,
      method: 'put',
      data: formData,
      contentType: 'application/x-www-form-urlencoded',
      success: function (response) {
        console.log(response)
      }
    })
  })
})
