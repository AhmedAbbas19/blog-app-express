const { check, validationResult } = require("express-validator");
const CustomeError = require("../../helper/custome-error");

const validatePostRequest = [
  check("title").notEmpty().withMessage("title is required"),
  check("body").notEmpty().withMessage("body is required"),
  check("author").notEmpty().withMessage("author is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomeError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

module.exports = {
  validatePostRequest,
};
