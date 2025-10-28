const blogRouter = require('express').Router();
const mongoose = require('mongoose')
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");


blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  if (!user) {
    return response.status(401).json({ error: "user missing or invalid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("🔥 Error creating blog:", error.message);
    response.status(500).json({ error: error.message });
  }
});

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(403).json({ error: 'unauthorized deletion' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})


blogRouter.put("/:id", async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }


    if (title !== undefined) blog.title = title;
    if (author !== undefined) blog.author = author;
    if (url !== undefined) blog.url = url;
    if (likes !== undefined) blog.likes = likes;

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;