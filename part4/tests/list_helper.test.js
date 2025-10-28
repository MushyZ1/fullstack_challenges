const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

// ===== DUMMY TEST =====
test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

// ===== SAMPLE BLOGS =====
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

// ===== TOTAL LIKES TESTS =====
describe("total likes", () => {
  test("when list has multiple blogs, equals the sum of likes", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36); // 7+5+12+10+0+2 = 36
  });

  test("when list is empty, equals zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([blogs[0]]);
    assert.strictEqual(result, 7);
  });
});

// ===== FAVOURITE BLOG TESTS =====
describe("favourite blog", () => {
  test("when list is empty, return null", () => {
    const result = listHelper.favouriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("when list has blogs, returns the one with most likes", () => {
    const result = listHelper.favouriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[2]); // "Canonical string reduction" with 12 likes
  });
});

// ===== MOST BLOG TESTS =====
describe("most blogs", () => {
  test("returns author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });

  test("returns null for empty list", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

// ===== MOST BLOG TESTS =====
describe("most likes", () => {
  test("returns author with most total likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 }); // 5 + 12
  });

  test("returns null for empty list", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
