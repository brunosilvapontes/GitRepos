var express = require('express')
var router = express.Router()
var githubService = require('../services/github')

// Get some github repositories' (not forks) data from a given username
router.get('/:username', function(req, res, next) {
	const username = req.params.username

	// Validate username parameter
	if (!username || username.length < 1) {
		const badRequestResponseMsg = {
			status: 400,
			Message: 'Bad request. Request parameter "username" is mandatory.'
		}
		return res.status(400).json(badRequestResponseMsg).end()
	}
	
	githubService.getRepositories(username)
		.then(repos => {
			return res.status(200).json(repos).end()
		})
		.catch(err => {
			// Username not found
			if (err && err.message === '404') {
				return res.status(404).json({status: 404, Message: 'Github username not found.'}).end()	
			}

			return res.status(500).json({status: 500, Message: err.message}).end()
		})
});

module.exports = router;
