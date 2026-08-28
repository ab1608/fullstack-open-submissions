const Blog = require('../models/blog');
const User = require('../models/user');

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

module.exports = { nonExistingId, blogsInId, usersInDb };
