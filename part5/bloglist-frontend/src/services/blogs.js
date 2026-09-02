import axios from 'axios';
const baseUrl = '/api/blogs';

// private variable
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

/*
e Axios POST method takes three parameters: URL, data, and config.
URL is the server path to which we are sending the request (note that it is a string).
data, which is an object, contains the request body that we're sending to the server.
config is the third parameter where you can specify the header content type, authorization, and more.
It is also in an object format.
*/
const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.post(baseUrl, newBlog, config);
  return res.data;
};

const update = async (id, updatedBlog) => {
  const res = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  return res.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};
export default { getAll, create, update, setToken, deleteBlog };
