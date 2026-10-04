import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const loginUser = (event) => {
    event.preventDefault();
    handleLogin({ username: username, password: password });

    setUsername('');
    setPassword('');

    navigate('/');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={loginUser}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
