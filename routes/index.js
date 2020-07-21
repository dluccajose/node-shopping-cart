var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var csrf = require('csurf')
var passport = require('passport')
var Cart = require('../models/cart')
var Order = require('../models/order')
var isLoggedIn = require('../middleware/login').isLoggedIn

// Proteccion contra el robo de sesiones
var csrfProtection = csrf()

// Utilizamos la proteccion en todas las rutas del router
router.use(csrfProtection)

/* GET home page. */
router.get('/', function(req, res, next) {

  var messages = req.flash('success')[0]

  // Limpiamos al variable
  req.session.oldUrl = null
  
  Product.find( function(err, docs) {
    // Separamos los productos en grupos de 3
    productsChunk = []
    chunkSize = 3
    for(var i=0; i<docs.length; i+=chunkSize) {
      productsChunk.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { 
      title: 'Shopping Cart', 
      products: productsChunk,
      messages,
      noMessages: !messages 
    });
  })
  
});




module.exports = router;
 