import { useState } from 'react';

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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
  };

  const handleTitle = (event) => setTitle(event.target.value);

  const handleAuthor = (event) => setAuthor(event.target.value);

  const handleUrl = (event) => setUrl(event.target.value);

  return (
    <form onSubmit={newBlog}>
      <div>
        title: <input onChange={handleTitle} />{' '}
      </div>
      <div>
        author: <input onChange={handleAuthor} />{' '}
      </div>
      <div>
        url: <input onChange={handleUrl} />{' '}
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default BlogForm;
