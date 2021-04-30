const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => res.render('/index.html'));
routes.get('/job', (req, res) => res.render('/job.html'));
routes.get('/job/edit', (req, res) => res.render('/job-edit.html'));
routes.get('/profile', (req, res) => res.render('/profile.html'));



module.exports  = routes;