
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars')
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users')
var cartRouter = require('./routes/cart')
var mongoose = require('mongoose')
var app = express();
var session = require('express-session')
var passport = require('passport')
var flash = require('connect-flash')
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session)

// .env 
require('dotenv').config()

// Mongoose configuration
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  if (err) {
    console.log('Error conectando con la base de datos', err)
  } else {
    console.log('Conectado exitosa con la base de datos')
  }
})

// Configuracion Passport
require('./config/passport')

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs');


// configuracion de paquetes adicionales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configuracion para las validaciones en formularios
app.use(validator())

// sesiones y paquetes que utilizan las sesiones
app.use(session({ 
  secret: 'palabrasecreta23123', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000 }
}))


app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


// middleware para saber si el usuario inicio sesion
// Las variables almacenadas en res.locals pueden ser utilizadas en las vistas
// automaticamente 
app.use(function(req, res, next) {
  res.locals.isLogin = req.isAuthenticated()
  res.locals.session = req.session
  next()
})

// configuracion de rutas
app.use('/', cartRouter)
app.use('/', indexRouter);
app.use('/user', userRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
