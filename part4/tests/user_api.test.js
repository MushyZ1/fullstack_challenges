const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const assert = require("node:assert");
const { beforeEach, after, describe, test } = require("node:test");

const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token = "";

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();

  // login to get token
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  token = loginResponse.body.token;
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("adding a new blog", () => {
  test("succeeds with valid token", async () => {
    const newBlog = {
      title: "Peaky Blinders Rise",
      author: "Tommy Shelby",
      url: "http://peakyblinders.com",
      likes: 100,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await Blog.find({});
    assert.strictEqual(blogs.length, 1);
    assert.strictEqual(blogs[0].title, newBlog.title);
  });

  test("fails with 401 if token is not provided", async () => {
    const newBlog = {
      title: "Unauthorized post",
      author: "No Token",
      url: "http://fake.com",
      likes: 5,
    };

    const result = await api.post("/api/blogs").send(newBlog).expect(401);
    assert.match(result.body.error, /token missing or invalid/);

    const blogs = await Blog.find({});
    assert.strictEqual(blogs.length, 0);
  });

  test("defaults likes to 0 if missing", async () => {
    const newBlog = {
      title: "No Likes Field",
      author: "Arthur Shelby",
      url: "http://shelby.co.uk",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("fails with 400 if title or url missing", async () => {
    const badBlog = {
      author: "John Shelby",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(badBlog)
      .expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
