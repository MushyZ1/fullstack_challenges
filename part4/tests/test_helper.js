const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "First blog",
    author: "Alice",
    url: "http://example.com/1",
    likes: 5,
  },
  {
    title: "Second blog",
    author: "Bob",
    url: "http://example.com/2",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "temp", url: "http://temp.com" });
  await blog.save();
  const id = blog._id.toString();
  await Blog.findByIdAndDelete(id); // safer than blog.remove()
  return id;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
    blogsInDb,
    nonExistingId,
  usersInDb
};
