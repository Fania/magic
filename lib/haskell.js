const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = {
  ls
}

async function ls() {
  const { stdout, stderr } = await exec('ls')
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}
// ls()


async function getTransformations() {
  const { stdout, stderr } = await exec('ls')
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}
// ls()