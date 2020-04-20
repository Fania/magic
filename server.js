'use strict'

const express = require('express')
// import express from 'express'
const app = express()


// POPULATE DATABASE
// import { populateDB, viewDB } from './lib/couch.js'
require('./lib/couch.js')
// populateDB('./data/sourceRaczinski880.json','sourceraczinski');
// populateDB('./data/index4R.json','indexraczinski')





// GENERATE INDEX
// import { initialIndex } from './lib/generators.js'
require('./lib/generators.js')
// console.log( initialIndex('4') )
// initialIndex('4')

const DomParser = require('dom-parser')
// import DomParser from 'dom-parser'
const parser = new DomParser()




// import * as d3 from 'd3'
// import * as d3s from 'd3-selection'
// import jsdom from "jsdom"

// const { JSDOM } = jsdom

// const { document } = (new JSDOM('')).window;

const svgTest = parser.parseFromString("<svg id='arc-4-3' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 300,200 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 300,300 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,200 A 50,50 0 1 1 0,100 A 50,50 0 1 1 100,100 A 50,50 0 1 1 300,0 A 50,50 0 1 1 200,0 A 50,50 0 1 1 0,0 '/></svg>", 'text/html')
const svgString = "<svg id='arc-4-3' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 300,200 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 300,300 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,200 A 50,50 0 1 1 0,100 A 50,50 0 1 1 100,100 A 50,50 0 1 1 300,0 A 50,50 0 1 1 200,0 A 50,50 0 1 1 0,0 '/></svg>"





// console.log( svgTest )

// let svgBase = d3s.create("svg")
// console.log( svgBase )
// const anchor = d3.html(svgString);
// console.log( anchor )
// const x = d3.select(svgTest); 
// console.log( x.select('.lines').node().getTotalLength() )

// import { svgPathProperties } from "svg-path-properties";
// const properties = new svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

// let test = "M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 300,200 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 300,300 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,200 A 50,50 0 1 1 0,100 A 50,50 0 1 1 100,100 A 50,50 0 1 1 300,0 A 50,50 0 1 1 200,0 A 50,50 0 1 1 0,0"
// d3.select('.lines').node().getTotalLength()

// import point from 'point-at-length'
// const svgPath = svgTest.getElementsByClassName('lines')[0]
// console.log( svgPath.getAttribute('d') )
// console.log( Math.ceil(point(svgPath.getAttribute('d')).length()) )
// const SVGprop = require("svg-path-properties")
// import { svgPathProperties } from 'svg-path-properties'
// // const properties2 = svgPathProperties("M0,100 Q50,-50 100,100 T200,100")
// console.log( svgPathProperties("M0,100 Q50,-50 100,100 T200,100") )
// const properties = svgPathProperties("M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 300,200 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 300,300 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,200 A 50,50 0 1 1 0,100 A 50,50 0 1 1 100,100 A 50,50 0 1 1 300,0 A 50,50 0 1 1 200,0 A 50,50 0 1 1 0,0")
// console.log( properties )
// const path = require("svg-path-properties");
// const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");
// console.log(properties)
// import { SVGPathProperties } from "svg-path-properties";
const path = require("svg-path-properties");
const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");
console.log(properties)





// START THE SERVER
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})

// SERVE STATIC FILES
app.use(express.static('./'));


// ROUTE INDEX
app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: './'})
})

// ROUTE DATA API
app.get('/data/4/all', async (req, res) => {
  const data = await viewDB('indexraczinski','order','numeric')
  res.send( data )
})
app.get('/data/4/unique', async (req, res) => {
  const data = await viewDB('indexraczinski','filter','unique')
  res.send( data )
})
app.get('/data/4/source', async (req, res) => {
  const data = await viewDB('sourceraczinski','order','numeric')
  res.send( data )
})


app.get('/data/4/test', async (req, res) => {
  res.sendFile('./data/outputs.json', {root: './'})
})