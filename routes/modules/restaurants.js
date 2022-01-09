const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// render search restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const sort = req.query.sort
  const sortTarget = sort.split(' ')[0]
  const sortType = sort.split(' ')[1]
  let searchRestaurants = []
  Restaurant.find()
    .lean()
    .sort({ sortTarget: sortType }) // sorting by name_en with ascending
    .then(restaurants => {
      searchRestaurants = restaurants.filter(restaurant => {
        return (
          restaurant.name.trim().toLowerCase().includes(keyword) ||
          restaurant.name_en.trim().toLowerCase().includes(keyword)
        )
      })
      res.render('index', { restaurants: searchRestaurants, keyword, sort })
    })
})

// render new page for adding restaurant
router.get('/new', (req, res) => {
  res.render('new')
})

// add new restaurant
router.post('/', (req, res) => {
  const userId = req.user._id
  const restaurant = req.body
  restaurant.userId = userId // add userId to the object
  // const {
  //   name,
  //   name_en,
  //   category,
  //   image,
  //   location,
  //   phone,
  //   google_map,
  //   rating,
  //   description,
  // } = req.body

  // Restaurant.create({
  //   userId,
  //   name,
  //   name_en,
  //   category,
  //   image,
  //   location,
  //   phone,
  //   google_map,
  //   rating,
  //   description,
  // })
  Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// render detail page of restaurant
router.get('/:restaurant_id', (req, res) => {
  // const restaurantId = req.params.restaurant_id
  // Restaurant.findById(restaurantId)
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOne({ userId, _id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// render edit page of restaurant
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOne({ userId, _id })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// update restaurant information
router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOneAndUpdate({ userId, _id }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// delete restaurant
router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOneAndDelete({ userId, _id })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
