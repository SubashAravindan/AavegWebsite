let daysS = document.querySelectorAll('.days')[0]
let hrsS = document.querySelectorAll('.hours')[0]
let minsS = document.querySelectorAll('.minutes')[0]
let secsS = document.querySelectorAll('.seconds')[0]
let daysS1 = document.querySelectorAll('.days')[1]
let hrsS1 = document.querySelectorAll('.hours')[1]
let minsS1 = document.querySelectorAll('.minutes')[1]
let secsS1 = document.querySelectorAll('.seconds')[1]

function countdown (endDate) {
  let days, hours, minutes, seconds

  endDate = new Date(endDate).getTime()

  if (isNaN(endDate)) {
    return
  }

  setInterval(calculate, 1000)

  function calculate () {
    let startDate = new Date()
    startDate = startDate.getTime()

    let timeRemaining = parseInt((endDate - startDate) / 1000)

    if (timeRemaining >= 0) {
      days = parseInt(timeRemaining / 86400)
      timeRemaining = (timeRemaining % 86400)

      hours = parseInt(timeRemaining / 3600)
      timeRemaining = (timeRemaining % 3600)

      minutes = parseInt(timeRemaining / 60)
      timeRemaining = (timeRemaining % 60)

      seconds = parseInt(timeRemaining)

      let stringD = '' + parseInt(days, 10)
      let stringH = '' + ('0' + hours).slice(-2)
      let stringM = '' + ('0' + minutes).slice(-2)
      let stringS = '' + ('0' + seconds).slice(-2)
      daysS.innerHTML = stringD[0]
      hrsS.innerHTML = stringH[0]
      minsS.innerHTML = stringM[0]
      secsS.innerHTML = stringS[0]

      daysS1.innerHTML = stringD[1]
      hrsS1.innerHTML = stringH[1]
      minsS1.innerHTML = stringM[1]
      secsS1.innerHTML = stringS[1]
    }
  }
}

countdown('02/01/2019 05:30:00 PM')

function water (event) { window.location.href = 'images/joke.jpeg' } // eslint-disable-line no-unused-vars
function display () { window.location.href = 'images/download.png' } // eslint-disable-line no-unused-vars

$('[data-toggle="popover"]').popover({
  animation: true,
  html: true,
  content:
  `<div id = "contactDiv">
<<<<<<< HEAD
  <p>Chairperson : Savita -<a href = "tel:+917339367931"> 7339367931</a></p>
=======
  <p>Chairman : Savita -<a href = "tel:+917339367931"> 7339367931</a></p>
>>>>>>> Fix timer page
  <p>Head, OC : Deeraj <a href="css/source.jpg" id="hi" class="links">-</a> <a href = "tel:+917339367931">9600852718 </a></p>
  <p>Head, OC : Evlin - <a href = "tel:+918129052491">8129052491 </a></p>
  <p>Head, Design : Yagnesh - <a href = "tel:+917358778423">7358778423 </a></p>
  <p>Head, Content : Ipsita - <a href = "tel:+918309974369">8309974369 </a></p>
  <p>Head, Marketing : Venkat - <a href = "tel:+919944729529">9944729529 </a></p>
  <p>Treasurer : Jaypal - <a href = "tel:+919566760500">9566760500 </a></p>
  <p>WebOps : Subash - <a href = "tel:+919791058966">9791058966 </a></p>
  </div>`
})

$(document).click(function (e) {
  if ($(e.target).closest('#contactLink').length) {
    return false
  } else {
    $('[data-toggle="popover"]').popover('hide')
  }
<<<<<<< HEAD
})

$(function () {
  if ($(window).width() <= 767) {
    $('#door1').attr('src', 'images/top.png')
    $('#door2').attr('src', 'images/bottom.png')
    $('.left-door').css('animation', 'slide-out-top 1s ease-in')
    $('.left-door').css('animation-delay', '2s')
    $('.left-door').css('animation-fill-mode', 'forwards')
    $('.right-door').css('animation', 'slide-out-bottom 1s ease-in')
    $('.right-door').css('animation-delay', '2s')
    $('.right-door').css('animation-fill-mode', 'forwards')
    $('.left-door').css('-webkit-animation', 'slide-out-top 1s ease-in')
    $('.left-door').css('-webkit-animation-delay', '2s')
    $('.left-door').css('-webkit-animation-fill-mode', 'forwards')
    $('.right-door').css('-webkit-animation', 'slide-out-bottom 1s ease-in')
    $('.right-door').css('-webkit-animation-delay', '2s')
    $('.right-door').css('-webkit-animation-fill-mode', 'forwards')
  }
})

$(function () {
  if ($(window).width() > 767) {
    $('#door1').attr('src', 'images/left-door.png')
    $('#door2').attr('src', 'images/right-door.png')
  }
=======
>>>>>>> Fix timer page
})
