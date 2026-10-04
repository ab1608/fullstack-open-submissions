import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Box,
  Stack,
  Link,
  Typography,
} from '@mui/material';

const Blog = ({ blog, handleLikes, handleDelete, loggedUser }) => {
  const [visibleDetail, setVisibleDetail] = useState(false);

  const navigate = useNavigate();

  const addLikes = (event) => {
    event.preventDefault();
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    handleLikes(blog.id, updatedBlog);
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (loggedUser !== null && blog.user.username === loggedUser.username)
      if (window.confirm(`Do you want to delete ${blog.title} ?`)) {
        handleDelete(blog.id);
        navigate('/');
      }
  };

  if (!blog) {
    return null;
  }
  return (
    <Card variant="outlined" sx={{ marginTop: 4, marginBottom: 4 }}>
      <CardHeader title={blog.title} subheader={`Authored by ${blog.author}`}></CardHeader>
      <CardContent>
        <Link component="div">{blog.url}</Link>
      </CardContent>

      <CardActions disableSpacing>
        <Typography variant={'body2'}>{blog.likes} likes</Typography>
        <Button onClick={addLikes}>Like</Button>
        <Button onClick={removeBlog} color="error">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default Blog;
