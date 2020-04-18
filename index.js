
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./views/index.html', 'utf-8')
})



server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    
  })


  const context = {
    title: 'fania',
    content: `<div>The visited URL is: {{ url }}</div>`
  }

  renderer.renderToString(app, context, (err, html) => {
    console.log("done")
  })



}) // server

server.listen(3000)