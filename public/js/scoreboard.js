var barChartDataCultural = {
  labels: ['Agate', 'Diamond', 'Coral', 'Jade', 'Opal'],
  datasets: [{
    label: 'Cultural',
    backgroundColor: '#09bc8a',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }]

}

var barChartDataSpectrum = {
  labels: ['Agate', 'Diamond', 'Coral', 'Jade', 'Opal'],
  datasets: [{
    label: 'Spectrum',
    backgroundColor: '#75dddd',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }]

}

var barChartDataSports = {
  labels: ['Agate', 'Diamond', 'Coral', 'Jade', 'Opal'],
  datasets: [{
    label: 'Sports',
    backgroundColor: '#f49d6e',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }]

}

var barChartData = {
  labels: ['Agate', 'Diamond', 'Coral', 'Jade', 'Opal'],
  datasets: [{
    label: 'Cultural',
    backgroundColor: '#09bc8a',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }, {
    label: 'Sports',
    backgroundColor: '#f49d6e',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }, {
    label: 'Spectrum',
    backgroundColor: '#75dddd',
    data: [
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1),
      Math.floor((Math.random() * 10) + 1)
    ]
  }]

}

window.onload = chartMaker(barChartData, true)

function chartMaker(dataset, stacked = false) {
  var ctx = document.getElementById('canvas').getContext('2d')
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: dataset,
    options: {
      title: {
        display: true,
        text: 'Points Statistics',
        fontColor: '#fff'
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: stacked,
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#fff'
          }
        }],
        yAxes: [{
          stacked: stacked,
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#fff',
            beginAtZero: true
          }
        }]
      },
      legend: {
        labels: {
          fontColor: 'rgb(255,255,255)'
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInQuad'
      }
    }
  })
}
