import { useImperativeHandle, useState } from 'react';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  // React CSS style to control visibility
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.viewLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideLabel}</button>
      </div>
    </div>
  );
};

export default Togglable;
