const mongoose = require("mongoose");
const _ = require("lodash");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [10, "too short"],
      maxlength: [70, "too long"],
      required: [true, "this fiels is required"],
    },
    slug: { type: String, slug: ["title", "_id"] },
    body: {
      type: String,
      minlength: [200, "too short"],
      required: [true, "this fiels is required"],
    },
    image: {
      type: Buffer,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "this fiels is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "this fiels is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
