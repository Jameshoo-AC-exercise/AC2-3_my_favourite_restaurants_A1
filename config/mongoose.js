const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/restaurant-list', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
