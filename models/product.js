const mongoose = require('mongoose')
const Schema = mongoose.Schema

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
})

// We export the model to use it
module.exports = mongoose.model('product', schema)