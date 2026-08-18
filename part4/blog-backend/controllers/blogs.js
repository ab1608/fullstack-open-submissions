const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
});

blogRouter.get('/info', (req, res) => {
  Blog.countDocuments({}).then((count) => {
    req.receivedDate = new Date();
    const info = {
      infoDate: req.receivedDate,
      message: `There are ${count} blogs stored.`,
    };
    res.send(info);
  });
});

blogRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((blog) => {
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

blogRouter.post('/', (req, res, next) => {
  const body = req.body; // req.body contains the json data

  const newBlog = new Blog({
    titel: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  newBlog
    .save()
    .then((blog) => {
      res.json(blog);
    })
    .catch((error) => next(error));
});

blogRouter.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  Blog.findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(404).end();
      }
      blog.title = body.title;
      blog.author = body.author;
      blog.url = body.url;
      blog.likes = body.likes;

      return Blog.save().then((updatedBlog) => {
        res.json(updatedBlog);
      });
    })
    .catch((error) => next(error));
});

blogRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((res) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
