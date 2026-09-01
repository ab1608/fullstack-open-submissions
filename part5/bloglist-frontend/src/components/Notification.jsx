const Notification = ({ message, successStatus }) => {
  if (message === null && successStatus === null) {
    return null;
  } else if (message !== null && successStatus === 1) {
    return <div className="success">{message}</div>;
  } else if (message !== null && successStatus === 0) {
    return <div className="error">{message}</div>;
  }
};

export default Notification;
