const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const bcrypt = require('bcryptjs')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const Product = require('../models/product')
const User = require('../models/user');

const verifyToken = (token) => {
  if (!token) {
    return { error: 'No token provided' };
  }
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return { error: 'Invalid token' };
  }
};

const verifyUser = async (request, response, next) => {
  const token = request.headers.authorization;

  const bearerToken = token.split(' ')[1];
  const decodedToken = verifyToken(bearerToken);

  if (decodedToken.error) {
    return response.status(401).json({ error: decodedToken.error });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  request.user = user;
  next()
};


router.get('/', async(request, response) => {
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

    Order.find({})
    .then((orders) => {
      response.json(orders)
    })
    .catch((error) => {
      console.error('Error fetching orders:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
} catch (err) {
    console.error('Authentication error:', err)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/:id', verifyUser, async(request, response) => {

  const id = request.params.id
  Order.findById(id)
    .then((order) => {
      if (order) {
        response.json(order)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.error('Error fetching order:', error)
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
    .then((deletedOrder) => {
        response.json(deletedOrder)
    })
    .catch((error) => {
      console.error('Error deleting order:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
  } catch (err) {
    console.error('Authentication error:', err)
    response.status(500).json({ error: 'Internal Server Error' })
  }
  
})

router.post('/', async (request, response) => {
  const {
    user,
    products,
    address,
  } = request.body;

  if (!user ||!products ||!address) {return response.status(400).json({ error: 'Missing required fields' });}

  try {

    console.log(products)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        address: address,
        user: JSON.stringify(user),
        products: JSON.stringify(products),
      },
        line_items: await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.id_product);
          if (product) {
            const unitAmount = Math.round(product.price * 100);
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: product.name,
                },
                unit_amount: unitAmount,
              },
              quantity: item.quantity,
            };
          } else {
            console.error(`Product with ID ${item.id_product} not found`);
            return null;
          }
        })
      ),
      success_url: "https://tienda-ecommerce-so3w.onrender.com",
      cancel_url: "https://tienda-ecommerce-so3w.onrender.com",
    });
    
    response.json({ url: session.url });
    console.log(session)
     
  } catch (error) {
    console.error('Error processing payment:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

router.use('/webhook', express.raw({ type: 'application/json' }));

const endpointSecret = process.env.ENDPOINTSECRET;

router.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];


  let event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const { user, products, address } = checkoutSessionCompleted.metadata;
      const order = new Order({
        user: JSON.parse(user),
        products: JSON.parse(products),
        address: address,
        paymentMethod: "card",
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        deliveredAt: null,
        createdAt: new Date()
      });

    const savedOrder = await order.save();


 const parsed_user = JSON.parse(user)
 const update = {
  $set: { cart: [] },
  $push: { orders: savedOrder }
}
    
let updatedUser = await User.findByIdAndUpdate(parsed_user._id, update, { new: true });

      console.log('Updated User:', updatedUser);

      response.json(savedOrder);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

module.exports = router