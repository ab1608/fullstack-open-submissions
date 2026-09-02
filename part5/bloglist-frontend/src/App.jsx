import { useEffect, useRef, useState } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import User from './components/User';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  // Notification details
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const getBlogs = async () => {
      const storedBlogs = await blogService.getAll();
      setBlogs(storedBlogs);
    };
    getBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const updateNotification = (message, successCode) => {
    setMessage(message);
    setSuccess(successCode);
    setTimeout(() => {
      setMessage(null);
      setSuccess(null);
    }, 5_000);
  };

  const handleLogin = async (userCredentials) => {
    try {
      const loggedUser = await loginService.login(userCredentials);
      // Save user credentials to browser
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
    } catch (error) {
      updateNotification(`Could not log in due to ${error}`, 0);
    }
  };

  const handleLogout = () => {
    // Delete user credentials
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      await blogService.create(blogObject);
      updateNotification('A new blog was created.', 1);

      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not create blog due to ${error}`, 0);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not delete blog due to ${error}`, 0);
    }
  };

  const handleLikes = async (blogId, updatedBlog) => {
    try {
      await blogService.update(blogId, updatedBlog);
      updateNotification('Blog was updated', 1);
      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not update blog due to ${error}`, 0);
    }
  };

  const displayBlogs = () => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
    return (
      <div>
        <h2>Blogs</h2>
        {sortedBlogs.map((b) => (
          <Blog
            key={b.id}
            blog={b}
            handleLikes={handleLikes}
            handleDelete={deleteBlog}
            loggedUser={user}
          />
        ))}
      </div>
    );
  };

  if (user === null) {
    return <LoginForm handleLogin={handleLogin} />;
  } else {
    return (
      <div>
        <User user={user} handleLogout={handleLogout} />
        <Notification message={message} successStatus={success} />
        <h2>Create new</h2>
        <Togglable viewLabel={'Create'} hideLabel={'Cancel'} ref={blogFormRef}>
          <BlogForm handleNewBlog={addBlog} />
        </Togglable>
        {displayBlogs()}
      </div>
    );
  }
};

export default App;
