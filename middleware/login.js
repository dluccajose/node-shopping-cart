function isLoggedIn(req, res, next) {
    // metodo agregado por passport
    if(req.isAuthenticated()) {
      return next()
    }
    req.session.oldUrl = req.url
    res.redirect('/user/signin')
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

module.exports = {
    isLoggedIn,
    isNotLoggedIn,
}