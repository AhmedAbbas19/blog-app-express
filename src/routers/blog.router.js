const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const Category = require("../models/category");
const {
  validatePostRequest,
} = require("../middlewares/blogs/validate-request");
require("express-async-errors");
const CustomeError = require("../helper/custome-error");
const Authorization = require("../middlewares/users/authorization");
const multer = require("multer");

const router = express.Router();

router.get("/", async (req, res, next) => {
  let start = Number(req.query.start) || 0;
  let size = Number(req.query.size) || 10;

  const blogs = await Blog.find()
    .sort({ createdAt: "desc" })
    .skip(start)
    .limit(size)
    .populate("author", {
      followers: 0,
      blogs: 0,
    })
    .populate("category");

  res.json(blogs);
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new CustomeError("Please upload an image", 400));
    }
    callback(undefined, true);
  },
});

router.post(
  "/",
  Authorization,
  upload.single("image"),
  async (req, res, next) => {
    const blog = new Blog(JSON.parse(req.body.blog));
    if (req.file) {
      blog.image = req.file.buffer;
    }
    const author = await User.findById(blog.author);
    if (!author) {
      throw new CustomeError("Invalid author id", 401);
    }
    const addedBlog = await blog.save();
    author.blogs.push(addedBlog);
    await User.update({ _id: author._id }, author);
    res.json({ message: "Blog added successfully" });
  }
);

router.patch(
  "/",
  Authorization,
  upload.single("image"),
  async (req, res, next) => {
    const parsedBlog = JSON.parse(req.body.blog);
    const blog = await Blog.findById(parsedBlog._id);
    if (!blog) {
      throw new CustomeError("Faild procces", 401);
    }
    const updates = Object.keys(parsedBlog);
    updates.forEach((update) => (blog[update] = parsedBlog[update]));
    if (req.file) {
      blog.image = req.file.buffer;
    }
    await blog.save();
    res.json({ message: "Blog edited successfully" });
  }
);

router.delete("/", Authorization, async (req, res, next) => {
  const { deletedCount } = await Blog.deleteOne({ _id: req.body.source });
  if (!deletedCount) {
    throw new CustomeError("Blog not found", 401);
  }
  res.json({ message: "Blog was deleted successfully" });
});

router.get("/slug/:slug", async (req, res, next) => {
  const slug = req.params.slug;
  const blog = await Blog.findOne({ slug: slug }).populate("author", {
    followers: 0,
    blogs: 0,
  });
  res.json(blog);
});

router.get("/categories", async (req, res, next) => {
  let title = req.query.title;
  const category = await Category.find({ title: title });
  if (!category) {
    throw new CustomeError("Category not found");
  }
  const blogs = await Blog.find({ category: category }).populate("author", {
    followers: 0,
    blogs: 0,
  });
  res.json(blogs);
});

router.get("/tags", async (req, res, next) => {
  let title = req.query.title;
  const blogs = await Blog.find({ tags: title }).populate("author", {
    followers: 0,
    blogs: 0,
  });
  res.json(blogs);
});

router.get("/search", async (req, res, next) => {
  let keyword = req.query.keyword;
  let type = req.query.type || "title"; // put some restrictions
  let blogs;
  switch (type) {
    case "user":
      const user = await User.findOne({
        fname: new RegExp(keyword, "i"),
      }).populate("blogs");
      if (!user) {
        throw new CustomeError("User not found", 404);
      }
      res.json(user.blogs);
      break;
    case "tag":
      blogs = await Blog.find({ tags: new RegExp(keyword, "i") }).populate(
        "author"
      );
      res.json(blogs);
      break;
    default:
      blogs = await Blog.find({ title: new RegExp(keyword, "i") }).populate(
        "author"
      );
      res.json(blogs);
      break;
  }
});

module.exports = router;
