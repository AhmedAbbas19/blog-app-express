const User = require("../../models/user");
const CustomeError = require("../../helper/custome-error");

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new CustomeError("Authorization required", 401);
  }
  req.user = await User.getUserFromToken(authorization);
  if (!req.user) {
    throw new CustomeError("User Authorization Failed", 401);
  }
  next();
};
