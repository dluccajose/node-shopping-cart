var passport = require('passport')
var User = require('../models/user')
var LocalStrategy = require('passport-local')

// serializamos por el id de usuario
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

// configuramos la estrategia de passport para registrar usuario
passport.use('local.strategy', new LocalStrategy({
    // establecemos el nombre del campo donde viene el correo y el password
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback: true
}, function(req, username, password, done) {

    // Validamos que sea un correo valido
    req.checkBody('userEmail', 'Correo invalido').notEmpty().isEmail()

    req.checkBody('userPassword', 'Password invalido. Debe contener minimo 6 caracteres').notEmpty().isLength({min: 6})

    var errors = req.validationErrors()

    if (errors) {

        var messages = []

        errors.forEach(error => {
            messages.push(error.msg)
        });

        // Proceso no exitoso, y mandamos los mensajes de errores
        return done(null, false, req.flash('error', messages))
    }

    // Validamos si el correo ya se encuentra en la base de datos
    User.findOne({ email: username}, function(err, user) {

        if(err) {
            // Indicamos que un error ocurrio
            return done(err)
        }

        if(user) {
            // No indicamos error del sistema, pero indicamos que el proceso no fue exitoso
            return done(null, false, { message: 'El correo ya se encuentra en uso'})
        }

        // Creamos una instancia de Usuario y asignamos el correo y password
        var newUser = new User()
        newUser.email = username
        newUser.password = newUser.encryptPassword(password)

        newUser.save(function(err, result) {

            if(err) {
                return done(err)
            }

            // Indicamos que el proceso fue exitoso y pasamos por parametro el Usuario
            return done(null, newUser)
        })
    })
}))

// Configuracion de estrategia para iniciar sesion
passport.use('local.iniciarSesion', new LocalStrategy({
    // Nombre de los campos donde vendran los datos de usuario
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback: true
}, function( req, username, password, done) {
     // Validamos si el correo ya se encuentra en la base de datos
     User.findOne({ email: username}, function(err, user) {
        if(err) {
            // Indicamos que un error ocurrio
            return done(err)
        }
        if(!user) {
            // No indicamos error del sistema, pero indicamos que el proceso no fue exitoso
            return done(null, false, { message: 'Usuario no encontrado'})
        }
        if(!user.validPassword(password)) {
            return done(null, false, { message: 'Contrase;a invalida'})
        }
        // Todo bien
        done(null, user)
    })
}))