var requestLib = require('request-promise-native')

exports.getRepositories = (_username) => {
	// Validate parameter
	if (!_username) return Promise.reject('Parameter username is mandatory')
	if (typeof(_username) !== 'string') return Promise.reject('Parameter username must be a string')

	let options = {
		uri: 'https://api.github.com/users/' + _username.trim() + '/repos',
		headers: {
			'User-Agent': 'Request-Promise',
			'Accept': 'application/vnd.github.v3+json'
		},
		json: true // Automatically parses the JSON string in the response
  }
	
  return requestLib(options)
		.then(repos => {
			return repos
		})
		.catch(err => {
			// Username not found
			if (err && err.statusCode === 404) {
				throw new Error('404')
			}

			throw new Error('Error on getting github repositories from ' + _username)
		})
}