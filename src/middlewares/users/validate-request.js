const { check, validationResult } = require("express-validator");
const CustomeError = require("../../helper/custome-error");

const validateLoginRequist = [
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomeError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateRegisterRequist = [
  check("fname").notEmpty().withMessage("first name is required"),
  check("lname").notEmpty().withMessage("last name is required"),
  check("email").notEmpty().withMessage("email is required"),
  check("username").notEmpty().withMessage("username is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomeError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validUpdateReuest = (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "fname", "age", "followers"];
  const isValidOperation = updates.some((u) => allowedUpdates.includes(u));
  if (!isValidOperation) {
    throw new CustomeError("Invalid update field!", 422);
  }
  next();
};

module.exports = {
  validateLoginRequist,
  validateRegisterRequist,
  validUpdateReuest,
};
