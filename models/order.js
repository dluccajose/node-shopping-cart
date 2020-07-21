const mongoose = require('mongoose')
const Schema = mongoose.Schema

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    cart: {type: Object, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    paymentId: {type: String, required: true}
})

// We export the model to use it
module.exports = mongoose.model('order', schema)