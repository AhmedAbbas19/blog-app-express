const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  title: {
    type: String,
    minlength: [3, "too short"],
    maxlength: [20, "too long"],
  },
  image: Buffer,
});

module.exports = model("Category", categorySchema);
