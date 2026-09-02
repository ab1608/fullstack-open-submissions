import { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const loginUser = (event) => {
    event.preventDefault();
    handleLogin({ username: username, password: password });

    setUsername('');
    setPassword('');
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
