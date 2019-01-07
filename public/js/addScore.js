$('document').ready(function () {
  $('.selectpicker').selectpicker()
})
window.onload = function () {
  $('#eventId').change(function () {
    let eventId = $(this).val()
    console.log(eventId)
    $.ajax({
      url: '/getPoints',
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
      } })
  })

  var ct = 3
  let addButton = document.getElementById('addPositionBlock')
  console.log(addButton)
  addButton.addEventListener('click', addPositionBlock)

  function addPositionBlock () {
    $.ajax(
      { url: '/api/hostels',
        type: 'GET',
        success: function (result) {
          console.log(JSON.stringify(result))
            ct++
          let br1 = document.createElement('br')
          let br2 = document.createElement('br')
          br1.classList.add('position'+ct+'-br')
          br2.classList.add('position'+ct+'-br')
          console.log('inside function')

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
            let len=wrapper.getElementsByClassName('position'+ct+'-br').length
            let br1 = wrapper.getElementsByClassName('position'+ct+'-br')[0]
            let br2 =wrapper.getElementsByClassName('position'+ct+'-br')[1]
            console.log(br1)
            console.log(br2)
            wrapper.removeChild(br1)
            wrapper.removeChild(br2)
            ct = ct - 1
          })
          div.appendChild(deleteButton)
          wrapper.appendChild(br1)
          wrapper.appendChild(br2)

          let positionLabel = document.createElement('Label')
          positionLabel.setAttribute('for', position)
          positionLabel.innerHTML = 'Position ' + ct + ' :'
          div.appendChild(positionLabel)

          let container = document.createElement('div')
          container.classList.add('container')

          let hostelDiv = document.createElement('div')
          hostelDiv.classList.add('hostel-div')
          let hostelLabel = document.createElement('Label')
          hostelLabel.setAttribute('for', position)
          hostelLabel.innerHTML = 'Hostel :'
          hostelDiv.appendChild(hostelLabel)

          let selectHostel = document.createElement('select')
          selectHostel.setAttribute('multiple', 'multiple')
          selectHostel.classList.add('selectpicker')
          selectHostel.setAttribute('data-live-search', 'true')

          for (let i = 0; i < result.length; i++) {
            let hostel = document.createElement('option')
            hostel.value = result[i]._id
            hostel.textContent = result[i].name
            selectHostel.appendChild(hostel)
          }
          hostelDiv.appendChild(selectHostel)
          container.appendChild(hostelDiv)

          let pointsDiv = document.createElement('div')
          pointsDiv.classList.add('points-div')
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
            $('.selectpicker').selectpicker()
          })
        }
      }
    )
  }
}
