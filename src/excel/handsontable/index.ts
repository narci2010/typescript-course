import Handsontable from 'handsontable'
// var Handsontable = require('handsontable')
import '~/handsontable/dist/handsontable.full.css'

export default function drawExcel() {
  const data = [
    ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
    ['2019', 10, 11, 12, 13],
    ['2020', 20, 11, 14, 13],
    ['2021', 30, 15, 12, 13]
  ]

  const container = document.getElementById('example')
  const hot = new Handsontable(container as Element, {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    licenseKey: 'non-commercial-and-evaluation'
  })
}
