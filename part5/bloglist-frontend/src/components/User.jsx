const User = ({ user, handleLogout }) => {
  return (
    <div>
      <div>Welcome {user.username}</div>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default User;
