const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
const mongoose = require('mongoose');

const GoogleStrategy = require('passport-google-oauth20').Strategy;






exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});



exports.verifyAdmin = function(req, res, next) {
    User.findOne({_id: req.user._id})
    .then((user) => {
        console.log("User: ", req.user);
        if (user.admin) {
            next();
        }
        else {
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        } 
    }, (err) => next(err))
    .catch((err) => next(err))
}











exports.GooglePassport=
passport.use(new GoogleStrategy({
    clientID: "432248578121-pddgn3ldmi95fcu46i61qfoqdtadslfu.apps.googleusercontent.com",
    clientSecret: "xONTXOBybsNkQj1iplZIK83I",
    callbackURL: "http://localhost:3000/users/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */

    console.log('******************************');
    console.log(profile);
    User.find({GoogleId: profile.id}, function(err, founduser){
        if(err)
        console.log(err)
        else
        {
          console.log(founduser);
         
           if(founduser.length==0)
           {
             
            
               User.register(new User({username: profile.emails[0].value}), 
               profile.id,(err, user) => {
               if(err) {
                 console.log(err);
               }
               else {
                   user.firstname = profile.name.givenName;
                   user.lastname = profile.name.familyName;
                   user.mobileno = '';
                   user.displayName= profile.displayName;  
                   user.GoogleId =profile.id;
                   user.userphoto= profile._json.picture;
                   user.save((err, user) => {
                   if (err) {
                     console.log(err);                     
                   }
                 });
               }
             });
           }
        }

    })
    console.log(profile);
    return done(null, profile);
  }
));