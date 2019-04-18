const router = require('express').Router()
const controller = require('../controllers/github')

// Get some github repositories' (not forks) data from a given username
router.get('/:username', controller.getRepositories)

module.exports = router
