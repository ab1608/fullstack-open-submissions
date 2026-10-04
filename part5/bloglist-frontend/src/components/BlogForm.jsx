import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const newBlog = (event) => {
    event.preventDefault();
    handleNewBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
    event.target.reset();
    navigate('/');
  };

  const handleTitle = (event) => setTitle(event.target.value);

  const handleAuthor = (event) => setAuthor(event.target.value);

  const handleUrl = (event) => setUrl(event.target.value);

  return (
    <form onSubmit={newBlog}>
      <div>
        <label>
          title <input onChange={handleTitle} />
        </label>
      </div>
      <div>
        <label>
          author <input onChange={handleAuthor} />
        </label>
      </div>
      <div>
        <label>
          url <input onChange={handleUrl} />
        </label>
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default BlogForm;
