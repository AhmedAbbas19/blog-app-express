const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const util = require("util");
const { saltRound, jwtSecret } = require("../../config");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const userSchema = new Schema(
  {
    fname: {
      type: String,
      minlength: [2, "too short"],
      maxlength: [10, "too long"],
      required: true,
    },
    lname: {
      type: String,
      minlength: [2, "too short"],
      maxlength: [10, "too long"],
      required: true,
    },
    username: {
      type: String,
      trim: true,
      minlength: [5, "too short"],
      maxlength: [20, "too long"],
      unique: [true, "This username is already registered"],
      required: "username is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "This email is already registered"],
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [7, "too short"],
      maxlength: [30, "too long"],
      required: true,
    },
    about: {
      type: String,
      maxlength: [200, "too long"],
    },
    imageUrl: String,
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    console.log(user);
    user.password = await bcrypt.hash(user.password, Number(saltRound));
  }
  next();
});

userSchema.methods.checkPassword = async function (plainPassword) {
  const user = this;
  return bcrypt.compare(plainPassword, user.password);
};

userSchema.methods.generateToken = function () {
  const user = this;
  return jwtSign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
};

userSchema.statics.getUserFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

module.exports = model("User", userSchema);
