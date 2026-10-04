const User = ({ user, handleLogout }) => {
  return (
    <div>
      <h2>Welcome {user.username}</h2>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default User;
