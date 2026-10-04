import { Link } from 'react-router-dom';

const BlogList = ({ blogs }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {sortedBlogs.map((b) => {
          return (
            <li key={b.id}>
              <Link to={`/api/blogs/${b.id}`}>{b.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogList;
