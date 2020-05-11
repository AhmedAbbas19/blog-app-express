const express = require("express");
const User = require("../models/user");
const Authorization = require("../middlewares/users/authorization");
const {
  validateRegisterRequist,
  validateLoginRequist,
  validUpdateReuest,
} = require("../middlewares/users/validate-request");
const CustomeError = require("../helper/custome-error");
require("express-async-errors");

const router = express.Router();

router.get("/:username", Authorization, async (req, res, next) => {
  const username = req.params.username;
  const user = await User.findOne({ username: username }).populate("blogs");
  res.json(user);
});

router.post("/register", validateRegisterRequist, async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "user was registered successfully" });
});

router.post("/login", validateLoginRequist, async (req, res) => {
  const user = await User.findOne(
    {
      email: req.body.email,
    },
    { blogs: 0 }
  );
  if (!user) {
    throw new CustomeError("Email not exists", 401);
  }
  const matchPassword = await user.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomeError("Incorrect Password", 401);
  }
  const token = await user.generateToken();
  res.json({
    message: "Logged in successfully",
    user,
    token,
  });
});

router.patch("/", Authorization, async (req, res) => {
  const user = await User.findOne({ _id: req.body.activeId }, { password: 0 });
  const follower = await User.findOne(
    { _id: req.body.followerId },
    { password: 0 }
  );
  let states = "Following";
  if (req.body.follow) {
    user.followers.push(req.body.followerId);
  } else {
    const idx = user.followers.findIndex((f) => f === req.body.followerId);
    user.followers.splice(idx, 1);
    states = "Unfollowing";
  }
  await user.save();
  res.json({ message: `${states} ${follower.fname}` });
});

module.exports = router;
