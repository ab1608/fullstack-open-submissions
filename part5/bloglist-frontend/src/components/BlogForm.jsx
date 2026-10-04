import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

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
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={newBlog}>
        <div>
          <TextField label={'title'} onChange={handleTitle}></TextField>
        </div>
        <div>
          <TextField label={'author'} onChange={handleAuthor}></TextField>
        </div>
        <div>
          <TextField label={'url'} onChange={handleUrl}></TextField>
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
