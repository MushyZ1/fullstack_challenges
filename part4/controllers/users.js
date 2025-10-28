const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;


  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "username and password required" });
  }

  if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({
        error: "username and password must be at least 3 characters long",
      });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  
  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    // handle unique username error
    if (error.code === 11000) {
      return response.status(400).json({ error: "username must be unique" });
    }
    next(error); // let middleware handle other errors
  }
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  res.json(users);
});

module.exports = usersRouter;
