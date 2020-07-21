var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')
var Order = require('../models/order')
var Cart = require('../models/cart')

// GET Registrar usuario
router.get('/signup', function(req, res) {
  // Mensajes de error
  var messages = req.flash('error')
  // Mostramos pagina para signup
  res.render('user/signup', { csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0})
})

// POST Regsitrar Usuario Manejamos la peticion utilizando el Middleware de Passport
router.post('/signup', passport.authenticate('local.strategy', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
  if(req.session.oldUrl) {
    var oldUrl = req.session.oldUrl
    req.session.oldUrl = null
    res.redirect(oldUrl)
  } else {
    res.redirect('/user/profile')
  }
})

//  GET Iniciar sesion
router.get('/signin', isNotLoggedIn, function(req, res) {
  // Mensajes de error
  var messages = req.flash('error')
  // Mostramos pagina para signup
  res.render('user/signin', { csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0})
})

// POST Iniciar Sesion Manejamos la peticion utilizando el Middleware de Passport
router.post('/signin', passport.authenticate('local.iniciarSesion', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if(req.session.oldUrl) {
    var oldUrl = req.session.oldUrl
    req.session.oldUrl = null
    res.redirect(oldUrl)

  } else {
    res.redirect('/user/profile')
  }
})

// GET Perfil de usuario
router.get('/profile', isLoggedIn, function(req, res) {
  Order.find({ user: req.user}, function(err, orders) {
    
    if(err) {
      return res.write("Error!")
    }
    
    var cart;

    // Recorremos las ordenes para poder utilizar el metodo generateArray y guardar la informacion de cada items
    // al arreglo orders
    orders.forEach( order => {
      cart = new Cart (order.cart)
      order.items = cart.generateArray()    // Agregamos la propiedad items al objeto order
    })

    // Renderizamos el perfil del usuario y mandamos por parametro las ordenes
    res.render('user/profile', { orders: orders})
  })
})

//  GET Cerrar sesion
router.get('/logout', function(req, res) {
  // Metodo agregado por passport
  req.logout()
  req.session.cart = null
  res.redirect('/') 
})


module.exports = router;

function isLoggedIn(req, res, next) {
  // metodo agregado por passport
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function isNotLoggedIn(req, res, next) {
  // metodo agregado por passport
  console.log(req.isAuthenticated())
  if(!req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
} 