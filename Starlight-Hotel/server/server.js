/*
 Loading built-in modules
*/
const fs = require("fs")
const path = require("path")
/*
  Loading external modules
*/
const express = require("express")
const server = express()

/*
  Loading internal modules
*/
const config = require("./config/config")
const util = require('../models/util.js')
const homeController = require('../controllers/homeController')
const memberController = require('../controllers/memberController')

//----------------------------------------------------------------
// middleware
//----------------------------------------------------------------
server.use(express.static(config.ROOT))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use((request, response, next) => {
  util.logRequest(request,response)
  next()
})
homeController.get('/', (req,res) => {
  res.sendFile('index.html')
})
server.use(homeController)
server.use(memberController)


// catch all middleware
server.use((req, res, next) => {
  //res.status(404).sendFile('404.html',{root:config.ROOT})
  res.status(404).sendFile('404.html', { root: config.ROOT})
})
server.listen(config.PORT, "localhost", () => {
  console.log(`\t|Server listening on ${config.PORT}`)
})