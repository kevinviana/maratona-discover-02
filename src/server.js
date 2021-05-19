const express = require('express')
const server = express()
const routes = require('./routes')
const path = require('path')

server.set('views', path.join(__dirname, 'views'))

server.set('view engine', 'ejs')

server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3001, () => console.log('rodanu'))