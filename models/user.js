const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

userSchema = new Schema({
    email: {type:String, required:true},
    password: {type:String, required:true}
})

// funcion helper para encriptar el password
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5))
}

// Funcion helper para validar el password encriptado
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = new mongoose.model('user', userSchema)