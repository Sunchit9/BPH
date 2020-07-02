const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;



const postSchema = new Schema({
    name_of_item: {
        type: String,
        required: true
    },
    category_of_item: {
        type: String,
        required: true
    },
    material_of_item: {
        type: String,
        required: true
    },
    season_of_item: {
        type: String,
        required: true
    },
    price_of_item: {
        type: Currency,
        required: true,
        min: 0
    }, 
    images:[String],
    comments:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;