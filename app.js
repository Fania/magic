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




const { db } = require('./db')





// GET request
// home path
// router.get('/', async (ctx, next) => {
//   console.log(db.output);
//   return ctx.render('./index', { 
//     // content: 'Hello World'
//     content: db.output
//   })
// })
router.get('/', async (ctx, next) => {
  await db.output
  console.log(db.output);

  await next();

})

app.use( async ( ctx ) => {
  let title = 'Hello World'
  console.log(title)
  await ctx.render('./index', {
    content: title,
  })
})

// Bonus: Use parameter in URL
// eg. `https://eka-nodejs-koa-starter.glitch.me/name/Jane Doe`
router.get('/:content', (ctx, next) => {
  return ctx.render('./index', { 
    // get content value from parameter
    content: ctx.params.content 
  })
});






app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});


// Add the given middleware function to this app
app.use(router.routes())
// app.use(router.allowedMethods())



app.listen(3000, ()=> console.log('Started http://localhost:3000'))