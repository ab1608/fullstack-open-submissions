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
import { Container, AppBar, Toolbar, Button } from '@mui/material';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  // Notification details
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef(null);
  // Requested blog details
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

  const updateNotification = (message, severityType) => {
    setNotification({ text: message, type: severityType });
    setTimeout(() => {
      setNotification(null);
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
      updateNotification(`Could not log in due to ${error}`, 'error');
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
      updateNotification('A new blog was created.', 'success');
      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not create blog due to ${error}`, 'error');
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not delete blog due to ${error}`, 'error');
    }
  };

  const handleLikes = async (blogId, updatedBlog) => {
    try {
      await blogService.update(blogId, updatedBlog);
      updateNotification('Blog was liked', 'success');
      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
    } catch (error) {
      updateNotification(`Could not update blog due to ${error}`, 'error');
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

  // React in-line CSS for Navigation
  const padding = { padding: 5 };
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } };

  return (
    <Container>
      <div>
        {/* Page navigation links*/}
        <AppBar position={'static'}>
          <Toolbar>
            <Button color="inherit" component={Link} to={'/'} sx={style}>
              blogs
            </Button>
            <Button color="inherit" component={Link} to={'/create'} sx={style}>
              new blog
            </Button>
            <Button color="inherit" component={Link} to={'/login'} sx={style}>
              login
            </Button>
          </Toolbar>
        </AppBar>

        <Notification notification={notification}></Notification>

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
    </Container>
  );
};

export default App;
