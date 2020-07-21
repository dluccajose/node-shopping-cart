var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var Cart = require('../models/cart')
var Order = require('../models/order')
var Order = require('../models/order')
var isLoggedIn = require('../middleware/login').isLoggedIn

// agregar producto al carrito
router.get('/add-to-cart/:id', function(req, res) {
    var producId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : { items: {}, totalQty: 0, totalPrice: 0})
  
    Product.findById(producId, function(err, product) {
      if(err) {
        console.log(err)
        return res.redirect('/error')
      }
  
      cart.add(product, producId)
      req.session.cart = cart
      console.log(req.session.cart)
      res.redirect('/')
    })
  })
  
// Eliminar un producto

router.get('/shopping-cart/reduce/:id', function(req, res) {
  let id = req.params.id
  let cart = new Cart(req.session.cart)
  cart.removeOne(id)
  req.session.cart = cart
  res.redirect('/shopping-cart')
})

  // Ver carrito de compras
  router.get('/shopping-cart', function(req, res) {
    if(!req.session.cart) {
       return res.render('shop/shopping-cart', { products: null})
    }

    var cart = new Cart(req.session.cart)

    return res.render('shop/shopping-cart', { products: cart.generateArray()})
  })
  
  // Checkout
  router.get('/checkout', isLoggedIn, function(req, res) {
    if(!req.session.cart || req.session.cart.totalPrice === 0) {
      return res.redirect('/shopping-cart')
    }
  
    var errMsg = req.flash('error')[0]

    return res.render('shop/checkout', {
      noError: !errMsg, 
      errMsg
    })
  })
  
  // Procesar compra
  router.post('/checkout', function(req, res, next) {
    if(!req.session.cart) {
      return res.redirect('/shopping-cart')
    }
  
    let cart = new Cart(req.session.cart)
    var stripe = require('stripe')('sk_test_iACwJOBSrt3tfKRgYqli6cJR003Zj2PymE');
  
    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    stripe.charges.create(
      {
        amount: cart.totalPrice * 100,
        currency: 'usd',
        source: req.body.stripeToken,
        description: 'My First Test Charge (created for API docs)',
      },
      function(err, charge) {
        
        if(err) {
          req.flash('error', err.message)
          return res.redirect('/checkout')
        }
        // Compra exitosa
        let order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
        })
  
        order.save( function(err, result) {
          if(err) {
              return console.log(err)
          }
          req.flash('success', 'Has realizado tu compra exitosamente!')
          req.session.cart = null
          console.log(result)
          res.redirect('/')  
        })
      }
    );
  })

  module.exports = router;