var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var githubRouter = require('./routes/github');
var auth = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/github', auth.checkAcceptHeader, githubRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

module.exports = app;
