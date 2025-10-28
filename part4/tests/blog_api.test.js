const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  const user = new User({ username: "testuser", passwordHash });
  const savedUser = await user.save(); // ✅ ensure user is persisted

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id.toString(), // ensure it’s a string
  };

  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });
});

describe("adding a new blog", () => {
  test("succeeds with valid token", async () => {
    const newBlog = {
      title: "Authorized Blog",
      author: "Thomas Shelby",
      url: "http://peaky.blinders",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("fails with 401 if token is not provided", async () => {
    const newBlog = {
      title: "Unauthorized Blog",
      author: "No Token",
      url: "http://example.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
});
