$('[data-toggle="popover"]').popover({
  animation: true,
  html: true,
  content:
  `<div id = "contactDiv">
  <p>Chairperson : Savita -<a href = "tel:+917339367931"> 7339367931</a></p>
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
})
