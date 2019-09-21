var gc = require('@grapecity/spread-sheets')

window.onload = function() {
  var workbook = new gc.Spread.Sheets.Workbook(document.getElementById('ss'))
  var worksheet = workbook.getActiveSheet()
  worksheet.getCell(3, 3).value('SpreadJS Npm Package in Webpack Project')
}
