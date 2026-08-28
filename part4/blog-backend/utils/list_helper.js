const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlog = [
  {
    title: 'My First Blog',
    author: 'Abraham',
    url: 'www.myfirstblog.com',
    likes: 1,
  },
];

const nonExistingId = async () => {
  const testBlog = new Blog({ title: 'Test Blog To Remove' });
  await testBlog.save();
  await testBlog.deleteOne();

  return testBlog._id.toString();
};

const blogsInId = async () => {
  const allBlogs = await Blog.find({});
  return allBlogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const allUsers = await User.find({});
  return allUsers.map((u) => u.toJSON());
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (accumulator, value) => {
    // Get the likes property from each blog post
    return accumulator + value.likes;
  };

  // 0 no blogs have been created yet
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let max = 0;
  let maxIndex = 0;

  for (i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes;
      maxIndex = i;
    }
  }

  return blogs[maxIndex];
};

/**
 * Return the object that holds the name of the author with
 * the likes and the quantity of likes.
 * @param: blogs - the object containing data about blogs
 */
const mostBlogs = (blogs) => {
  // Example: {"Bill: 2, "Kim": 3}
  const authorPosts = new Map();

  let maxBlogs = 0;
  let maxAuthor = null;

  blogs.forEach((blog) => {
    // If author is not yet in the map, return 1
    const posts = (authorPosts.get(blog.author) ?? 0) + 1;
    authorPosts.set(blog.author, posts);

    if (posts > maxBlogs) {
      maxBlogs = posts;
      maxAuthor = blog.author;
    }
  });

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  };
};

/**
 * Return the author whose blog posts have the largest amount of likes.
 *
 * @param {object} blogs - Contains data about the blogs.
 * @returns {object} Name of the author and the total likes received.
 */
const mostLikes = (blogs) => {
  const authorLikes = new Map();

  let maxLikes = 0;
  let maxAuthor = 0;

  blogs.forEach((blog) => {
    const likes = (authorLikes.get(blog.author) ?? 0) + blog.likes;
    authorLikes.set(blog.author, likes);

    if (likes > maxLikes) {
      maxLikes = likes;
      maxAuthor = blog.author;
    }
  });

  return {
    author: maxAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlog,
  nonExistingId,
  blogsInId,
  usersInDb,
};
