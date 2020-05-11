const mongoose = require("mongoose");
const { MongooseUri } = require("../../config");

mongoose
  .connect(MongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database server is connected");
  })
  .catch(() => {
    console.log("Database connection faild");
  });
