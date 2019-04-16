const githubService = require('../services/github')

// Get some github repositories' (not forks) data from a given username
exports.getRepositories = (req, res) => {
	const username = req.params.username

	// Validate username parameter
	if (!username || username.length < 1) {
		const badRequestResponseMsg = {
			status: 400,
			Message: 'Bad request. Request parameter "username" is mandatory.'
		}
		return res.status(400).json(badRequestResponseMsg).end()
	}
	
	let reposNotFork = null

	githubService.getRepositories(username)
		.then(repos => {
			// Check if given username has any repository
			if (!repos || repos.length < 1) {
				return []
			}
			
			// Remove fork ones
			reposNotFork = repos.filter(repo => {return repo.fork === false})

			// Check if given username has any repository that is not a fork
			if (!reposNotFork || reposNotFork.length < 1) {
				return []
			}

			// For each repository, get branches' data
			let promisesGetBranches = []
			reposNotFork.forEach(repoNotFork => {
				promisesGetBranches.push(githubService.getBranchesData(repoNotFork))
			})
			return Promise.all(promisesGetBranches)
		})
		.then(branches => {
			let responseBody = []
			reposNotFork.forEach((repoNotFork, i) => {
				let responseObject = {
					repositoryName: repoNotFork.name || 'Unknown repository name',
					ownerLogin: (repoNotFork.owner && repoNotFork.owner.login) ? repoNotFork.owner.login : 'Unknown owner login',
					branches: []
				}

				// Get branch's name and last commit sha
				if (branches && branches[i] && typeof(branches[i]) === 'object' && branches[i].length > 0) {
					branches[i].forEach(branch => {
						let branchObject = {
							name: branch.name ? branch.name : 'Unknown branch name',
							lastCommitSha: (branch.commit && branch.commit.sha) ? branch.commit.sha : 'Unknown last commit sha'
						}
						responseObject.branches.push(branchObject)
					})
				}

				responseBody.push(responseObject)
			})

			return res.status(200).json(responseBody).end()
		})
		.catch(err => {
			// Github 404 not found
			let notFoundMsg = null
			if (err && err.message === 'username_404') {
				notFoundMsg = 'Github username not found.'
			} else if (err && err.message === 'owner_or_repo_404') {
				notFoundMsg = 'Owner or repository not found.'
			}
			if (notFoundMsg) return res.status(404).json({status: 404, Message: notFoundMsg}).end()	

			return res.status(500).json({status: 500, Message: err.message}).end()
		})
}

