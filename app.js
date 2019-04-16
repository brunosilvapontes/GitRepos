const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const githubRouter = require('./routes/github');
const auth = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/github', auth.checkAcceptHeader, githubRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

module.exports = app;
