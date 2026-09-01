import { Fragment, useEffect, useState } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import User from './components/User';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  // User credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Blog details
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  // Notification details
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      // Save user credentials to browser
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
      setUsername('');
      setPassword('');
    } catch (error) {
      updateNotification(`Could not log in due to ${error}`, 0);
    }
  };

  const handleLogout = () => {
    // Delete user credentials
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    setUsername('');
    setPassword('');
  };
  const loginForm = () => {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => {
                  setUsername(target.value);
                }}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  const handleTitle = (event) => setTitle(event.target.value);

  const handleAuthor = (event) => setAuthor(event.target.value);

  const handleUrl = (event) => setUrl(event.target.value);

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = { title, author, url };

      await blogService.create(newBlog);
      updateNotification('A new blog was created.', 1);

      const latestBlogs = await blogService.getAll();
      setBlogs(latestBlogs);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      updateNotification(`Could not create blog with ${error}`, 0);
    }
  };

  if (user === null) {
    return loginForm();
  } else {
    return (
      <div>
        <User user={user} handleLogout={handleLogout} />
        <Notification message={message} successStatus={success} />
        <h2>Blogs</h2>
        {blogs.map((b) => (
          <Blog key={b.id} blog={b} />
        ))}
        <h2>Create new</h2>
        <BlogForm
          handleAuthor={handleAuthor}
          handleTitle={handleTitle}
          handleUrl={handleUrl}
          addBlog={addBlog}
        />
      </div>
    );
  }
};

export default App;
