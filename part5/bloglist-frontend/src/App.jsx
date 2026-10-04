import { useEffect, useRef, useState } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import User from './components/User';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import BlogList from './components/BlogList.jsx';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  // Notification details
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  const blogFormRef = useRef(null);
  const match = useMatch('/api/blogs/:id');
  const matchBlog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

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

  const displayLogin = () => {
    if (!user) {
      return <LoginForm handleLogin={handleLogin} />;
    } else {
      return (
        <div>
          <User user={user} handleLogout={handleLogout} />
        </div>
      );
    }
  };

  // React in-line CSS for Link navigation bar
  const padding = { padding: 5 };

  return (
    <div>
      {/* Page navigation links*/}
      <div>
        <Link style={padding} to={'/'}>
          blogs
        </Link>
        <Link style={padding} to={'/create'}>
          new blog
        </Link>
        {(!user && (
          <Link style={padding} to={'/login'}>
            login
          </Link>
        )) || <button onClick={handleLogout}>logout</button>}
      </div>

      {/* Routes and their corresponding elements */}
      <Routes>
        <Route path={'/'} element={<BlogList blogs={blogs} />}></Route>

        <Route path={'/login'} element={displayLogin()}></Route>

        <Route path={'/create'} element={<BlogForm handleNewBlog={addBlog} />}></Route>

        <Route
          path={'/api/blogs/:id'}
          element={
            <Blog
              blog={matchBlog}
              handleLikes={handleLikes}
              handleDelete={deleteBlog}
              loggedUser={user}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
