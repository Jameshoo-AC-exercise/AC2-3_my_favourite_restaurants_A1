const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

const userList = require('./users.json').results
const restaurantList = require('./restaurants.json').results
const restaurant = require('../restaurant')

db.once('open', () => {
  // 產生加密後 user 到 mongoDB
  Promise.all(
    // 因爲 Promise.all 需要一個回傳的 array 所以可以透過 map 來回傳一個 promise array 提供給 Promise.all
    userList.map(userInfo => {
      const { email, password, restaurantId } = userInfo
      // map 每一次需要執行多行代碼的話，需要用 return 把執行 functions 抱起來 return
      console.log('here 1')
      return (
        User.findOne({ email }) // 判斷 mongoDB 内是否已存在 user
          .then(user => {
            // 判斷只有 mongoDB 内不存在的 user 才開始建立新資料
            if (!user) {
              return bcrypt
                .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
                .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
                .then(hash =>
                  // 產生使用者
                  User.create({
                    email,
                    password: hash, // 用雜湊值取代原本的使用者密碼
                  })
                )
                .catch(error => console.log(error))
            }
          })
          // 產生對應的餐廳
          .then(user => {
            console.log(user)
            const userId = user._id
            const userRestaurants = []
            restaurantId.forEach(id => {
              userRestaurants.push(
                restaurantList.find(restaurant => {
                  if (restaurant.id === id) {
                    restaurant.userId = userId // 把 userId 加入餐廳資料
                    return restaurant
                  }
                })
              )
              console.log('here 3')
            })
            return userRestaurants
          })
          .then(restaurants => {
            console.log('here 4')
            console.log(restaurants)
            Restaurant.create(restaurants) // 把指定 restaurants 的餐廳存入 mongoDB
              // .then(restaurant => console.log(restaurant))
              .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
      )
    })

    // --------------------- forEach 不適合使用在 Promise.all，雖然有出現要的結果但是 terminal 會報錯 ------------------------------------------
    // userList.forEach(user => {
    //   const { email, password, restaurantId } = user
    //   User.findOne({ email }) // 判斷 mongoDB 内是否已存在 user
    //     .then(userDB => {
    //       // 判斷只有 mongoDB 内不存在的 user 才開始建立新資料
    //       if (!userDB) {
    //         bcrypt
    //           .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
    //           .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
    //           .then(hash =>
    //             User.create({
    //               email,
    //               password: hash, // 用雜湊值取代原本的使用者密碼
    //             })
    //           )
    //           // 產生對應的餐廳
    //           .then(user => {
    //             const userId = user._id
    //             // 根據使用者資料裏已包含的餐廳資料 id，創建餐廳資料
    //             restaurantId.forEach(id => {
    //               let userRestaurant = restaurantList.find(
    //                 restaurant => restaurant.id === id
    //               )
    //               userRestaurant.userId = userId // 把 userId 加入餐廳資料
    //               Restaurant.create(userRestaurant) // 把指定 userId 的餐廳存入 mongoDB
    //             })
    //           })
    //           .catch(error => console.log(error))
    //       }
    //     })
    //     .catch(error => console.log(error))
    // })
  )
    .then(() => {
      console.log('done !')
      process.exit()
    })
    .catch(error => console.log(error))
})
