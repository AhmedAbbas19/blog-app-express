const express = require("express");
const Category = require("../models/category");
const multer = require("multer");

require("express-async-errors");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  res.json(categories);
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

router.patch("/:id", upload.single("image"), async (req, res, next) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) {
    throw new CustomeError("Faild procces", 401);
  }
  if (req.file) {
    cat.image = req.file.buffer;
  }
  await cat.save();
  res.json({ message: "Category edited successfully" });
});

module.exports = router;
