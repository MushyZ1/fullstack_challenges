const dummy = (blogs) => {
  return 1;
};


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
};

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
    return blogs.find(blog => blog.likes === mostLikes);
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const counts = {}; 
  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
  });

  let topAuthor = null;
  let maxBlogs = 0;

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxBlogs = counts[author];
      topAuthor = author;
    }
  }

  return { author: topAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesCount = {};
  blogs.forEach((blog) => {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes;
  });

  let topAuthor = null;
  let maxLikes = 0;

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxLikes = likesCount[author];
      topAuthor = author;
    }
  }

  return { author: topAuthor, likes: maxLikes };
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
};
