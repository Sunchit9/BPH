var express = require('express');
var router = express.Router();
var logger = require('morgan');
var authenticate = require('../config');
const bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/users');


const multer =require('multer');
const Comments = require('../models/comments');




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});
const upload = multer({storage : storage}).single('userphoto');

const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}
/* GET users listing. */
router.route('/profile/:id/edit').
get( function(req, res, next) {

  if(req.user.provider!='google')
  {
    User.findById(req.user._id,function(err,founduser){
      console.log(founduser);
      res.render('profileedit',{currentuser:founduser});
    })
  }
  else
  {
    User.find({GoogleId: req.user.id}, function(err,founduser){
      if(err)
      console.log(err);
      else
      {   
        console.log('google user');
        console.log(founduser[0]);
        res.render('profileedit',{currentuser: founduser[0]});
    }
  })
  }
  
})
.post(function(req,res,next){
  
  console.log(req.body);
  if(req.body.save=='Save')
  {
    upload(req,res,function(err) {
    User.findById(req.params.id, function(err, user) {
      if(!err) {
          if(!user) {
              res.send('User not found');
          }          
          var fn= req.body.firstname.substr(0,1).toUpperCase()+ req.body.firstname.substr(1,req.body.firstname.length);
          var ln= req.body.lastname.substr(0,1).toUpperCase()+ req.body.lastname.substr(1,req.body.lastname.length);
          user.firstname =fn;
          user.lastname=ln;
          user.displayName= fn+ ' '+ ln;
          user.mobileno= req.body.mobileno;
          if(user.userphoto!=req.body.imageis)
          user.userphoto= '/'+req.body.imageis;
          console.log(req.body.userphoto);
          
            if(err)
            console.log(err)
            else
             {
               user.save(function(err) {
              if(!err) {
                  console.log("user updated");
                  res.redirect('/');
              }
              else {
                  console.log("Error: could not save user " + err);
              }
             });
             }
          }
          
    })
  })

  }
  else if(req.body.delete == 'Delete My Account')
  {
    User.findOneAndRemove({_id: req.params.id}, (err, response) => { 
      
 } )
}
});


router.get('/profile/:id', function(req, res, next) {
  if(req.user.provider!='google')
  {
    User.findById(req.user._id,function(err,founduser){
      console.log(founduser);
      res.render('profile',{currentuser:founduser});
    })
  }
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







