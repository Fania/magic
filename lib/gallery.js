const fs = require('fs')


module.exports = {
  getImgs
}


function getImgs() {
  return fs.readdirSync('./meta/imgs/gallery')
}