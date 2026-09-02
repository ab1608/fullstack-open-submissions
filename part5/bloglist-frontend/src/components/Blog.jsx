import { useState } from 'react';

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
    }
  };

  const deleteBlogButton = () => {
    if (loggedUser != null && blog.user.username === loggedUser.username) {
      console.log(loggedUser);
      return <button onClick={removeBlog}>Delete</button>;
    }
  };

  const blogDetails = () => {
    return (
      <div>
        <div>Author: {blog.author}</div>
        <div>
          Likes: {blog.likes}
          <button onClick={addLikes}>Like</button>
        </div>
        <div>Url: {blog.url}</div>
        <div>Posted by: {blog.user.username}</div>
        {/*{deleteVisible && <button onClick={removeBlog}>Delete</button>}*/}
        {deleteBlogButton()}
        {/*<button onClick={removeBlog}>Delete</button>*/}
      </div>
    );
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={handleVisible}>{buttonLabel}</button>
      </div>
      {visibleDetail && blogDetails()}
    </div>
  );
};

export default Blog;
