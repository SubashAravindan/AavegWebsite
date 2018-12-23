
window.onload = function () {
  $('#eventId').change(function () {
    let eventId = $(this).val()
    console.log(eventId)
    $.ajax({
      url: '/getPoints',
      type: 'POST',
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
          let br1 = document.createElement('br')
          let br2 = document.createElement('br')
          console.log('inside function')
          ct++
          let position = 'position' + ct
          let wrapper = document.getElementById('p-div')

          let div = document.createElement('div')
          div.classList.add('border-class')
          div.setAttribute('id', 'div' + ct)
          let deleteButton = document.createElement('button')
          deleteButton.innerHTML = 'X Close'
          deleteButton.classList.add('delete')
          deleteButton.addEventListener('click', function () {
            console.log('in remove')
            let elem = document.getElementById('div' + ct)
            elem.parentNode.removeChild(elem)
            console.log(wrapper.getElementsByTagName('br'))
            let br1 = document.getElementsByTagName('br')[-3]
            let br2 = document.getElementsByTagName('br')[-4]
            br1.removeChild(br1)
            br2.removeChild(br2)
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
          selectHostel.setAttribute('style', 'float:right')

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
          console.log(div)
          wrapper.appendChild(div)
          console.log('appends done')
          console.log(wrapper)
        }
      }
    )
  }
}
