$(document).ready(function () {
  var counter = 4
  $(document).on('click', '#addPoints', () => {
    document.getElementById('wrapdiv').innerHTML = document.getElementById('wrapdiv').innerHTML + ('<label for="points' + counter + '">Points for Winner ' + counter + ': </label><input type="number" id="points' + counter + '" name="points' + counter + '">')
    counter = counter + 1
  })
  $(document).on('click', '#submitCreate', () => {
    var points = []
    for (var i = 1; i < counter; i++) { points.push($('#points' + i.toString()).val()) }
    const formData = {
      'name': $('#eventName').val(),
      'cluster': $('#cluster').val(),
      'cup': $('#cup').val(),
      'points': points,
      'places': counter - 1,
      'venue': $('#venue').val(),
      'description': $('#description').val(),
      'rules': $('#rules').val(),
      'date': $('#date').val(),
      'startTime': $('#startTime').val(),
      'endTime': $('#endTime').val()
    }
    $.ajax({
      url: '/admin/events',
      method: 'post',
      data: formData,
      contentType: 'application/x-www-form-urlencoded',
      success: function (response) {
        console.log(response)
      }
    })
  })
})
