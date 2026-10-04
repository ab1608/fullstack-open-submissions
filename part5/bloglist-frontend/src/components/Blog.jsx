import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = ({ blog, handleLikes, handleDelete, loggedUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visibleDetail, setVisibleDetail] = useState(false);
  const buttonLabel = visibleDetail ? 'Hide' : 'View';
  const navigate = useNavigate();

  const handleVisible = (event) => {
    event.preventDefault();
    setVisibleDetail(!visibleDetail);
  };

  const addLikes = (event) => {
    event.preventDefault();
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    handleLikes(blog.id, updatedBlog);
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Do you want to delete ${blog.title} ?`)) {
      handleDelete(blog.id);
      navigate('/');
    }
  };

  const deleteBlogButton = () => {
    if (loggedUser !== null && blog.user.username === loggedUser.username) {
      return <button onClick={removeBlog}>Delete</button>;
    }
  };

  const blogDetails = () => {
    return (
      <div id={'blog-details'}>
        <div>
          Likes: {blog.likes}
          {loggedUser && <button onClick={addLikes}>Like</button>}
        </div>
        <div>Url: {blog.url}</div>
        {deleteBlogButton()}
      </div>
    );
  };

  if (!blog) {
    return null;
  }
  return (
    <div style={blogStyle} id="blog-primary">
      <div>
        {blog.title} {blog.author}
        <button onClick={handleVisible}>{buttonLabel}</button>
      </div>
      {visibleDetail && blogDetails()}
    </div>
  );
};

export default Blog;
