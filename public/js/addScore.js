$('document').ready(function () {
  $('.select-selectize').selectize({
    delimiter: ',',
    persist: false,
    create: function (input) {
      console.log('askjfkjs')
      return {
        value: input,
        text: input
      }
    }
  })
  $('.select-selectize-single').selectize({
    sortField: 'text'
  })
})
window.onload = function () {
  $('#eventSelector').change(function () {
    let eventId = $(this).val()
    $.ajax({
      url: 'getPoints',
      type: 'GET',
      datatype: 'JSON',
      data: { 'data': eventId },
      success: function (res) {
        for (let i = 0; i < res.length; i++) {
          if (res.length === 3) {
            let id = 'points' + (i + 1)
            let input = document.getElementById(id)
            input.value = res[i]
          }
        }
      }
    })
  })

  var ct = 3
  let addButton = document.getElementById('addPositionBlock')
  console.log(addButton)
  addButton.addEventListener('click', addPositionBlock)

  function addPositionBlock () {
    $.ajax(
      {
        url: 'api/hostels',
        type: 'GET',
        success: function (result) {
          console.log(JSON.stringify(result))
          ct++

          let position = 'position' + ct
          let wrapper = document.getElementById('p-div')

          let div = document.createElement('div')
          div.classList.add('border-class')
          div.setAttribute('id', 'div' + ct)
          let deleteButton = document.createElement('button')
          deleteButton.innerHTML = 'Close ❌ '
          deleteButton.classList.add('delete')
          deleteButton.addEventListener('click', function () {
            console.log('in remove')
            let elem = document.getElementById('div' + ct)
            elem.parentNode.removeChild(elem)
            ct = ct - 1
          })
          div.appendChild(deleteButton)

          let positionHead = document.createElement('h1')
          positionHead.innerHTML = 'Position ' + ct + ':'
          div.appendChild(positionHead)

          let container = document.createElement('div')
          container.classList.add('container')
          container.classList.add('row')

          let hostelDiv = document.createElement('div')
          hostelDiv.classList.add('col-6')
          hostelDiv.classList.add('col-12-small')
          let hostelLabel = document.createElement('Label')
          hostelLabel.setAttribute('for', position)
          hostelLabel.innerHTML = 'Hostel :'
          hostelDiv.appendChild(hostelLabel)

          let selectHostel = document.createElement('select')
          selectHostel.setAttribute('multiple', 'multiple')
          selectHostel.classList.add('select-selectize')

          for (let i = 0; i < result.length; i++) {
            let hostel = document.createElement('option')
            hostel.value = result[i]._id
            hostel.textContent = result[i].name
            selectHostel.appendChild(hostel)
          }
          hostelDiv.appendChild(selectHostel)
          container.appendChild(hostelDiv)

          let pointsDiv = document.createElement('div')
          pointsDiv.classList.add('col-6')
          pointsDiv.classList.add('col-12-small')
          let pointsLabel = document.createElement('Label')
          var points = 'points' + ct
          pointsLabel.setAttribute('for', points)
          pointsLabel.innerHTML = 'Points :'
          pointsDiv.appendChild(pointsLabel)

          let input = document.createElement('input')
          input.type = 'number'
          input.name = points
          input.id = points
          input.defaultValue = 0
          input.min = 0
          pointsDiv.appendChild(input)

          container.appendChild(pointsDiv)
          div.appendChild(container)
          wrapper.appendChild(div)
          $(document).ready(function () {
            $(selectHostel).selectize({
              delimiter: ',',
              persist: false,
              create: function (input) {
                console.log('askjfkjs')
                return {
                  value: input,
                  text: input
                }
              }
            })
          })
        }
      }
    )
  }
}
