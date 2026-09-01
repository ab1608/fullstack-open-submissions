const User = ({ user, handleLogout }) => {
  return (
    <div>
      <div>Welcome {user.name}</div>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default User;
