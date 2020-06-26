var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/forgotpassword', function(req,res,next){
  console.log("ForgotPassword Requested");
  res.render("forgotpassword");
});
app.use('/login', function(req,res,next){
  console.log("Login Page Requested");
  res.render("login");
});

app.use('/signup', function(req,res,next){
  console.log("Signup Page Requested");
  res.render("signup");
});
app.use('/', function(req,res,next){
  console.log("Home Page Requested");
  res.render("home");
});


app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
