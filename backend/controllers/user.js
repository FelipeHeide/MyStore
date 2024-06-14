const usersRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD


const generateToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

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

usersRouter.get('/', async (request, response) => {
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
      const users = await User.find({}, { passwordHash: 0 });
      response.json(users);
} catch (err) {
  console.error('Authentication error:', err)
  response.status(500).json({ error: 'Internal Server Error' })
}
});

usersRouter.get('/:id', verifyUser, async (request, response) => {
  const user = await User.findById(request.params.id, { passwordHash: 0 });
  if (user) {
    if (user._id.toString() === request.user._id.toString()) {
      response.json(user);
    } else {
      response.status(403).json({ error: 'Forbidden' });
    }
  } else {
    response.status(404).end();
  }
});

usersRouter.post('/', async (request, response) => {
  const { username, name, email, password } = request.body;
  if (!username || !password || !name || !email) {
    return response.status(400).json({ error: 'Username, password, email and name are required' });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return response.status(409).json({ error: 'Username is already in use' });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return response.status(409).json({ error: 'Email is already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    email,
    passwordHash,
  });

  const savedUser = await user.save();
  const token = generateToken(savedUser);
  response.status(201).json({ token, user: savedUser });
});

usersRouter.delete('/:id', verifyUser, async (request, response) => {
  const deletedUser = await User.findByIdAndDelete(request.user._id);
  response.json(deletedUser);
  response.status(204).end();
});

usersRouter.put('/:id', verifyUser, async (request, response) => {
  const { username, name, email, cart, favorites, orders } = request.body;
 
  const update = {
    username,
    name,
    email,
    cart,
    favorites,
    orders,
  };

  const updatedUser = await User.findByIdAndUpdate(request.user._id, update, { new: true });
  console.log('Updated User:', updatedUser);
  response.json(updatedUser);
});

module.exports = usersRouter;