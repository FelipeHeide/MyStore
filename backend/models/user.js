const mongoose = require('mongoose');
const Order = require('./order'); // Import the Order model

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  cart: [{ quantity: Number, id_product: String }],
  favorites: [ String ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference the Order model

});

const User = mongoose.model('User', userSchema);

module.exports = User;