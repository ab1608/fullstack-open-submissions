const BlogForm = ({ handleTitle, handleAuthor, handleUrl, addBlog }) => {
  return (
    <form>
      <div>
        {' '}
        title: <input onChange={handleTitle} />{' '}
      </div>
      <div>
        {' '}
        author: <input onChange={handleAuthor} />{' '}
      </div>
      <div>
        {' '}
        url: <input onChange={handleUrl} />{' '}
      </div>
      <div>
        {' '}
        <button type="submit" onClick={addBlog}>
          create
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
