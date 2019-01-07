$(document).ready(function () {
  let prizeCounter = 3
  prizeCounter = prizeCounter + 1
  $(document).on('click', '#addPoints', () => {
    document.getElementById('wrapdiv').innerHTML = document.getElementById('wrapdiv').innerHTML +
    ('<label for="points' + prizeCounter +
    '">Points for Winner ' + prizeCounter +
    ': </label><input type="number" id="points' + prizeCounter +
    '" name="points' + prizeCounter + '">')
    prizeCounter = prizeCounter + 1
  })
  let start = document.getElementById('startTime')
  let end = document.getElementById('endTime')
  start.addEventListener('change', function () {
    if (start.value) { end.min = start.value }
  }, false)
  $(document).on('click', '#submitCreate', () => {
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
      url: 'admin/events',
      method: 'post',
      data: formData,
      contentType: 'application/x-www-form-urlencoded',
      success: function (response) {
        console.log(response)
      }
    })
  })
})
