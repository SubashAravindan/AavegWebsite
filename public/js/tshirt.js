$('.requirementSelector').on('change', (e) => {
  console.log($('#requirement-both').prop('checked'))
  if ($('#requirement-both').prop('checked') === true) {
    $('#tshirt-selector').removeClass('hidden')
    $('#size').prop({ required: true })
  } else {
    $('#tshirt-selector').addClass('hidden')
    $('#size').prop({ required: false })
  }
})
