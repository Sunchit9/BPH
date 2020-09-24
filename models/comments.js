const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;
const User= require('./users');
var commentSchema = new Schema({
    
    text:  {
        type: String,
        required: true
    },
    author: {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        userphoto:{type: String},
        username:{ type: String}
        
    }
}, { timestamps: true
})



var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;