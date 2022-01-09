const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

const userList = require('./user.json').results
const restaurantList = require('./restaurant.json').results

db.once('open', () => {
  Promise.all(
    // Outer array: generating user
    userList.map(userItem => {
      return bcrypt
        .genSalt(10)
        .then(salt => {
          return bcrypt.hash(userItem.password, salt)
        })
        .then(hash => {
          return User.create({ email: userItem.email, password: hash })
        })
        .then(user => {
          return Promise.all(
            // Inner array: generating restaurant
            restaurantList
              .filter(restaurantItem => {
                return userItem.restaurantMap.includes(restaurantItem.id)
              })
              .map(restaurantItem => {
                const {
                  name,
                  category,
                  image,
                  location,
                  phone,
                  google_map,
                  rating,
                  description,
                } = restaurantItem
                return Restaurant.create({
                  userID: user._id,
                  name,
                  category,
                  image,
                  location,
                  phone,
                  googleMap,
                  rating,
                  description,
                })
              })
            // End of inner array
          )
        })
    })
    // End of Outer array
  ).then(() => {
    console.log('Done!')
    process.exit()
  })
})

// db.once('open', () => {
//   console.log('mongodb connected!')
//   Promise.all(
//     SEED_USER.forEach(seedUser => {
//       bcrypt
//         .genSalt(10)
//         .then(salt => bcrypt.hash(seedUser.password, salt))
//         .then(hash =>
//           User.create({
//             name: seedUser.name,
//             email: seedUser.email,
//             password: hash,
//           })
//         )
//         .then(user => {
//           const userId = user._id
//           return Promise.all(
//             Array.from({ length: 3 }, (_, i) =>
//               Todo.create({ restaurantList[i], userId })
//             )
//           )
//         })
//     })
//   )
//     .then(() => {
//       console.log('done.')
//       process.exit()
//     })
//     .catch(error => console.error(error))

//   // create the data of restaurants.json in mongoDB
//   // Restaurant.create(restaurantList)
//   //   .then(() => {
//   //     console.log('restaurantSeed done !!!')
//   //     db.close()
//   //   })
//   //   .catch(error => console.error(error))
// })
