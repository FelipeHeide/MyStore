const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./controllers/user')
const loginRoutes = require('./controllers/login')
const productRoutes = require('./controllers/product')
const orderRoutes = require('./controllers/order')
const cors = require('cors');
const { requestLogger, unknownEndpoint } = require('./middleware/middleware')
const path = require('path') // Import the path module

app.use(cors());
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));
app.use(express.json())

const mongoUrl = process.env.MONGO_URL

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

app.use(requestLogger)

app.use('/api/users', userRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use(express.static('dist'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use(unknownEndpoint)

module.exports = app
