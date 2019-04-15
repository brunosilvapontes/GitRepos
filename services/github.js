var requestLib = require('request-promise-native')

exports.getRepositories = (_username) => {
	// Validate parameter
	if (!_username) return Promise.reject('Parameter username is mandatory.')
	if (typeof(_username) !== 'string') return Promise.reject('Parameter username must be a string.')

	let requestOptions = {
		uri: 'https://api.github.com/users/' + _username.trim() + '/repos',
		headers: {
			'User-Agent': 'Request-Promise',
			'Accept': 'application/vnd.github.v3+json'
		},
		json: true // Automatically parses the JSON string in the response
  	}
	
	return requestLib(requestOptions)
		.then(repos => {
			// Validate github response
			if (!repos || typeof(repos) !== 'object') {
				throw new Error('Invalid github response (getting repositories).')
			}

			return repos
		})
		.catch(err => {
			// Username not found
			if (err && err.statusCode === 404) {
				throw new Error('username_404')
			}

			throw new Error(err.message)
		})
}

exports.getBranchesData = (_repository) => {
	// Validate parameter
	if (!_repository) return Promise.reject('Parameter repository is mandatory.')
	if (typeof(_repository) !== 'object') return Promise.reject('Invalid parameter type.')
	if (!_repository.name || typeof(_repository.name) !== 'string' || _repository.name.length < 1) {
		return Promise.reject('Invalid repository name.')
	}
	if (!_repository.owner 
		 || !_repository.owner.login 
		 || typeof(_repository.owner.login) !== 'string' 
		 || _repository.owner.login.length < 1
	) {
		return Promise.reject('Invalid owner login.')
	}

	const owner = _repository.owner.login.trim()
	const repo = _repository.name.trim()

	let requestOptions = {
		uri: 'https://api.github.com/repos/' + owner + '/' + repo + '/branches',
		headers: {
			'User-Agent': 'Request-Promise',
			'Accept': 'application/vnd.github.v3+json'
		},
		json: true // Automatically parses the JSON string in the response
  	}

	return requestLib(requestOptions)
		.then(branches => {
			// Validate github response
			if (!branches || typeof(branches) !== 'object') {
				throw new Error('Invalid github response (getting branches).')
			}

			return branches
		})
		.catch(err => {
			// Owner or repo not found
			if (err && err.statusCode === 404) {
				throw new Error('owner_or_repo_404')
			}

			throw new Error(err.message)
		})
			
}