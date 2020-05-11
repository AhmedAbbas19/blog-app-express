require("dotenv").config();
const requiredEnvs = ["jwtSecret", "MongooseUri"];
const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);
if (missingEnvs.length) {
  throw new Error(`Missing required envs ${missingEnvs}`);
}
module.exports = {
  port: process.env.port || 3000,
  jwtSecret: process.env.jwtSecret,
  saltRound: process.env.saltRound || 8,
  MongooseUri: process.env.MongooseUri,
};
