# GitRepos

Given a github username, this REST API returns his github repositories, which are not forks. For each repository, it's returned its name, owner login, and for each branch, its name and last commit sha.

You need to have Node.js installed and run 'npm install' on Terminal before using.

To run the tests:
$ npm run test

To run the application:
$ npm run start

To run and develop (this will automatically restart the server when you update a file):
$ nodemon -L

How to use:
Add the Header Accept: application/json
Request a GET on localhost:3000/github/<PUT_A_GITHUB_USERNAME>
