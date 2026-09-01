const Blog = ({ blog }) => {
  return (
    <div>
      {blog.title} {blog.author} {blog.url}
    </div>
  );
};

export default Blog;
