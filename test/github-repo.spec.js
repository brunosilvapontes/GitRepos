const chai = require('chai')
const expect = chai.expect
const auth = require('../routes/auth')
const githubService = require('../services/github')
const routeController = require('../controllers/github')

describe("Accept header tests", function() {
	it("Accept header application/json", function(done) {	
		let nextHasBeenCalled = false
		let next = () => {nextHasBeenCalled = true}
		let req = {
			headers: {accept: 'application/json'}
		}
		auth.checkAcceptHeader(req, null, next)
		expect(nextHasBeenCalled).to.equal(true)
		done(); // Finish test
	})
	it("Reject header application/xml", function(done) {
		let nextHasBeenCalled = false
		let next = () => {nextHasBeenCalled = true}
		let req = {
			headers: {accept: 'application/xml'}
		}
		try {
			auth.checkAcceptHeader(req, null, next)
		}
		catch (err) {
			expect(nextHasBeenCalled).to.equal(false)
			done() // Finish test
		}
	})
})

describe("Github service tests", function() {
	it("Get brunosilvapontes repositories", function(done) {
		githubService.getRepositories('brunosilvapontes')
			.then(repos => {
				expect(repos).to.have.lengthOf.at.least(2)
				expect(repos[0]).to.have.nested.property('owner.login')
				done()
			})
	})
	it("404 user not found", function(done) {
		githubService.getRepositories('bbbruuuunnnooosillvvvvvvapontess')
			.then(repos => {})
			.catch(err => {
				expect(err.message).to.equal('username_404')
				done()
			})
	})
})

describe("Route test", function() {
	it("username brunosilvapontes", function(done) {
		let fakeStatusCode = null
		let fakeResponseBody = null
		let fakeResponse = {
			status: (_fakeStatusCode) => {
				fakeStatusCode = _fakeStatusCode
				let statusReturn = {
					json: (_fakeResponseBody) => {
						fakeResponseBody = _fakeResponseBody
						return {
							end: () => {
								expect(fakeStatusCode).to.equal(200)
								expect(fakeResponseBody[0]).to.have.nested.property('branches[0].lastCommitSha')
								done()
							}
						}
					}
				}
				return statusReturn
			}
		}

		let fakeRequest = {
			params: {username: 'brunosilvapontes'}
		}

		routeController.getRepositories(fakeRequest, fakeResponse)
	})
})