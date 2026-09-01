const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  return res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const foundBlog = await Blog.findById(id);

  if (foundBlog) {
    res.json(foundBlog);
  } else {
    res.status(404).end();
  }
});

blogRouter.post('/', async (req, res) => {
  const body = req.body; // req.body contains the json data

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(400).json({ error: 'user id missing or invalid' });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const existingBlog = await Blog.findById(id);

  if (!existingBlog) {
    res.status(404).end();
  } else {
    existingBlog.title = body.title;
    existingBlog.author = body.author;
    existingBlog.url = body.url;
    existingBlog.likes = body.likes;
  }

  const updatedBlog = await existingBlog.save();
  res.json(updatedBlog);
});

blogRouter.delete('/:id', async (req, res) => {
  const blogId = req.params.id;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(400).json({ error: 'user id missing or invalid' });
  }

  const foundBlog = await Blog.findById(blogId);

  if (!foundBlog) {
    return res.status(404).end();
  }

  if (foundBlog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(blogId);
    user.blogs = user.blogs.filter((b) => b.toString() !== foundBlog._id.toString());
    await user.save();
    return res.status(204).end();
  }

  return res.status(400).json({ error: 'blog creator and token owner do not match' });
});

blogRouter.get('/info', async (req, res) => {
  const blogCount = await Blog.countDocuments({});
  req.receivedDate = new Date();

  const info = {
    infoDate: req.receivedDate,
    message: `There are ${blogCount} blogs stored.`,
  };

  res.send(info);
});

module.exports = blogRouter;
