const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  return res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  if (password.length > 3) {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } else {
    res.status(401).json({ error: 'password must be greater than 3 characters long' });
  }
});

module.exports = usersRouter;
