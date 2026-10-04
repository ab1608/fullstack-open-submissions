import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const BlogList = ({ blogs }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>author</TableCell>
              <TableCell>likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map((b) => {
              return (
                <TableRow key={b.id}>
                  <TableCell>
                    <Link to={`/api/blogs/${b.id}`}>{b.title}</Link>
                  </TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>{b.likes}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogList;
