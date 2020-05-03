const fs = require('fs')


module.exports = {
  getFiles
}


function getFiles() {
  
  const imgFiles = fs.readdirSync('./meta/gallery/img')
  const vidFiles = fs.readdirSync('./meta/gallery/vid')
  const artFiles = fs.readdirSync('./meta/gallery/art')
  
  return { 
    "images": imgFiles, 
    "videos": vidFiles, 
    "renders": artFiles
  }

}