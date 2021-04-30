const express = require('express')
const routes = express.Router()

const basePath = __dirname + '/views'

routes.get('/', (req, res) => res.render(basePath+'/index.html'));
routes.get('/job', (req, res) => res.render(basePath+'/job.html'));
routes.get('/job/edit', (req, res) => res.render(basePath+'/job-edit.html'));
routes.get('/profile', (req, res) => res.render(basePath+'/profile.html'));



module.exports  = routes;