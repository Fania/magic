const fs = require('fs')
const util = require('util')
const child_process = require('child_process')
// const exec = util.promisify(require('child_process').exec)

module.exports = {
  ls
}

async function ls() {
  const { stdout, stderr } = await execSync('ls')
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}
// ls()


async function getTransformations() {
  const { stdout, stderr } = await execSync('ls')
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}
// ls()