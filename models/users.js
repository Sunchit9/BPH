
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseTypePhone = require('mongoose-type-phone');

var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    mobileno:
    {
        type: String
    },
    displayName:{
        type: String,
        default: ''
    },
    GoogleId: String,
    userphoto: {
        type: String
    },
    admin:   {
        type: Boolean,
        default: false
    }
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);