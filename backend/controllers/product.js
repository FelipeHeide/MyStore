const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Product = require('../models/product')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

router.get('/', (request, response) => {
    Product.find({})
    .then((products) => {
      response.json(products)
    })
    .catch((error) => {
      console.error('Error fetching products:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
})

router.get('/:id', (request, response) => {
  const id = request.params.id
  Product.findById(id)
    .then((product) => {
      if (product) {
        response.json(product)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.error('Error fetching product:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
})

router.delete('/:id', async (request, response) => {
    const { password } = request.headers

  if (!password) {
    return response.status(401).json({ error: 'Password is required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isMatch = hashedPassword===ADMIN_PASSWORD

    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid password' })
    }

    const id = request.params.id
  Product.findByIdAndDelete(id)
    .then((deletedProduct) => {
        response.json(deletedProduct)
    })
    .catch((error) => {
      console.error('Error deleting product:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
  } catch (err) {
    console.error('Authentication error:', err)
    response.status(500).json({ error: 'Internal Server Error' })
  }
  
})

router.post('/', async(request, response) => {
    const { password } = request.headers

  if (!password) {
    return response.status(401).json({ error: 'Password is required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const isMatch = hashedPassword===ADMIN_PASSWORD

    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid password' })
    }
    const body = request.body
    if (
      !body.name ||
      !body.description ||
      !body.category ||
      !body.price ||
      !body.image ||
      !body.brand
    ) {
      return response.status(400).json({ error: 'Missing required fields' })
    }
  
    const product = new Product({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      image: body.image,
      brand: body.brand,
      reviews: body.reviews || [],
    })
  
    product
      .save()
      .then((savedProduct) => {
        response.json(savedProduct)
      })
      .catch((error) => {
        console.error('Error saving product:', error)
        response.status(500).json({ error: 'Internal Server Error' })
      })
    } catch (err) {
      console.error('Authentication error:', err)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  })

router.put('/:id', async (request, response) => {
    const { password } = request.headers
    if (!password) {
      return response.status(401).json({ error: 'Password is required' })
    }
  
    try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

      const isMatch = hashedPassword === ADMIN_PASSWORD
      if (!isMatch) {
        return response.status(401).json({ error: 'Invalid password' })
      }
  
      const id = request.params.id
      const updatedFields = request.body
  
      Product.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true })
        .then((updatedProduct) => {
          if (updatedProduct) {
            response.json(updatedProduct)
          } else {
            response.status(404).json({ error: 'Product not found' })
          }
        })
        .catch((error) => {
          console.error('Error updating product:', error)
          response.status(500).json({ error: 'Internal Server Error' })
        })
    } catch (err) {
      console.error('Authentication error:', err)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  })
  
module.exports = router