const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../../models/user')

router.get(
  '/login',
  //   (req, res) => {
  //   res.render('login')
  //    }
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

// routes/modules/users.js
router.post('/login', (req, res) => {})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email }).then(user => {
    if (user) {
      console.log('user already exists.')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword,
      })
    } else {
      return User.create({
        name,
        email,
        password,
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

module.exports = router
