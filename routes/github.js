const router = require('express').Router()
const controller = require('../controllers/github')
const auth = require('./auth')

// Get some github repositories' (not forks) data from a given username
router.get('/:username', auth.checkAcceptHeader, controller.getRepositories)

module.exports = router
