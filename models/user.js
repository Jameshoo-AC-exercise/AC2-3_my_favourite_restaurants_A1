const mongoose = require('mongoose')
const Schema = mongoose.Schema

// data type identification
const restaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('user', userSchema)
