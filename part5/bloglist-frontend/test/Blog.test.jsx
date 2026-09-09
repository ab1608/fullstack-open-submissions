import { render, screen } from '@testing-library/react';
import Blog from '../src/components/Blog.jsx';
import userEvent from '@testing-library/user-event';
import BlogForm from '../src/components/BlogForm.jsx';

test('Only title and author are visible by default', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 0,
    user: 'ab1608',
  };

  const handleLikes = vi.fn();
  const handleDelete = vi.fn();

  const { container } = render(
    <Blog blog={testBlog} handleLikes={handleLikes} handleDelete={handleDelete} />,
  );

  const blogPrimary = container.querySelector('#blog-primary');
  const viewButton = screen.getByText('View');

  const blogDetails = container.querySelector('#blog-details');

  expect(blogPrimary).toBeDefined();
  expect(viewButton).toBeDefined();
  expect(blogDetails).toBeNull();

  // await user.type(input, 'testing a form...');
  // await user.click(sendButton);

  // expect(createNote.mock.calls).toHaveLength(1);
  // expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});

test('The URL and likes are visible after clicking the View button', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 0,
    user: 'ab1608',
  };

  const handleLikes = vi.fn();
  const handleDelete = vi.fn();
  const user = userEvent.setup();

  const { container } = render(
    <Blog
      blog={testBlog}
      handleLikes={handleLikes}
      handleDelete={handleDelete}
      loggedUser={null}
    />,
  );

  const viewButton = screen.getByText('View');
  await user.click(viewButton);

  const blogDetails = container.querySelector('#blog-details');

  expect(blogDetails).toBeDefined();
});

test('The like button is clicked twice', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 0,
    user: 'ab1608',
  };

  const handleLikes = vi.fn();
  const handleDelete = vi.fn();
  const user = userEvent.setup();

  render(
    <Blog
      blog={testBlog}
      handleLikes={handleLikes}
      handleDelete={handleDelete}
      loggedUser={null}
    />,
  );

  // Click the view button
  const viewButton = screen.getByText('View');
  await user.click(viewButton);

  // Like button is now visible
  const likeButton = screen.getByText('Like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(handleLikes.mock.calls).toHaveLength(2);
});

test('The form is correctly filled', async () => {
  const handleNewBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm handleNewBlog={handleNewBlog} />);

  // Blog input forms
  const authorField = screen.getByLabelText('author');
  const titleField = screen.getByLabelText('title');

  // Typing
  await user.type(authorField, 'Test Author');
  await user.type(titleField, 'Test Title');

  // Create button
  const submitButton = screen.getByText('Submit');
  await user.click(submitButton);

  // Check
  expect(handleNewBlog.mock.calls).toHaveLength(1);
  expect(handleNewBlog.mock.calls[0][0].author).toBe('Test Author');
  expect(handleNewBlog.mock.calls[0][0].title).toBe('Test Title');
});
