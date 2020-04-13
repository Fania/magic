'use strict'

const Koa = require('koa')
const app = new Koa()

const serve = require('koa-static')
const mount = require('koa-mount')
app.use(serve('./assets'))
app.use(serve('./assets/imgs'))
app.use(mount('/data', serve('data')))

const logger = require('koa-logger')
app.use(logger())

const Router = require('koa-router')
const router = new Router()

const views = require('koa-views')
app.use(views('./views', { map: { html: 'nunjucks' }}))


// GET request
// home path
router.get('/', (ctx, next) => {
  return ctx.render('./index', { 
    // replace with your name!
    name: 'Eka' 
  })
})

// Bonus: Use parameter in URL
// eg. `https://eka-nodejs-koa-starter.glitch.me/name/Jane Doe`
router.get('/name/:name', (ctx, next) => {
  return ctx.render('./index', { 
    // get name value from parameter
    name: ctx.params.name 
  })
});

// Add the given middleware function to this app
app.use(router.routes())
// app.use(router.allowedMethods())



app.listen(3000, ()=> console.log('Started http://localhost:3000'))