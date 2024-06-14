const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    _id: String,
    cart: Array,
    orders: Array,
    name: String,
    username: String,
    email: String
  },
  products: [
    {
      id_product: String,
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;