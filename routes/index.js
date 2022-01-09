const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

router.use('/', home)
router.use('/users', users)
router.use('/restaurants', restaurants)

module.exports = router
