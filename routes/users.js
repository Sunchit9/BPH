var express = require('express');
var router = express.Router();
var logger = require('morgan');
var authenticate = require('../config');
const bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/users');
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}
/* GET users listing. */
router.get('/profile/:id/edit', function(req, res, next) {
  res.render(profileedit,{currentuser: req.user})
});
router.get('/profile/:id', function(req, res, next) {
  if(req.user.provider!='google')
  res.render('profile',{currentuser:req.user});
  else
  {
    User.find({GoogleId: req.user.id}, function(err,founduser){
      if(err)
      console.log(err);
      else
      {   
        console.log('google user');
        console.log(founduser[0]);
        res.render('profile',{currentuser: founduser[0]});
    }
  })
  }
});





router.get('/login', function(req,res,next){
   res.render('login');
})
.post('/login',passport.authenticate('local'), function(req,res,next){
  res.statusCode = 200;
  res.redirect('/');
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    
    console.log("hello hi")
    console.log(req.user);
    res.redirect('/');
  }
);

router.get('/forgotpassword',function(req,res,next){
  res.render('forgotpassword');
})

router.get('/signup', function(req,res,next){
  res.render('signup');
})
.post('/signup', function(req,res,next){
  User.register(new User({username: req.body.username}), 
    req.body.password,(err, user) => {
    if(err) {
      res.statusCode = 500;
      res.send(err);
    }
    else {
        console.log(req.body);
        user.firstname = req.body.firstname.substr(0,1).toUpperCase()+ req.body.firstname.substr(1,req.body.firstname.length);
        user.lastname = req.body.lastname.substr(0,1).toUpperCase()+ req.body.lastname.substr(1,req.body.lastname.length);
        user.mobileno = req.body.mobileno;
        user.displayName= user.firstname+' '+user.lastname;  
        user.userphoto='';
        user.GoogleId='';
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err)
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          console.log('Registration Successful!');
          res.redirect('/');
        });
      });
    }
  });
})


router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

module.exports = router;































































/* GET users listing. */
/*router.get('/', cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  User.find({})
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
*/












