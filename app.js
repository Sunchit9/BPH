var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/postRouter');
var feedRouter = require('./routes/feedRouter');


const mongoose= require('mongoose');
const Posts = require('./models/posts');

var app = express();

app.use(cookieSession({
  name: 'BPH-session',
  keys: ['key1', 'key2']
}))


const url = 'mongodb://localhost:27017/BPH';
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('CONNECTED CORRECTLY TO SERVER');
}, (err) =>{
  console.log(err);
});


// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Auth middleware that checks if the user is logged in


app.use(passport.initialize());
app.use(passport.session());


app.get('/failed', (req, res) => res.send('You Failed to log in!'))






















app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/uploads'))



app.use('/', postRouter);
app.use('/users', usersRouter);



app.use('/', function(req,res,next){
  console.log("Home Page Requested");
  res.render("adminrights");
  next();
});


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
});

module.exports = app;
