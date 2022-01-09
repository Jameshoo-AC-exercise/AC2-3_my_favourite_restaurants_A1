module.exports = {
  // exports 一個 authenticator function
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  },
}
