const express = require("express");
require("./src/db/mongoose");
const { PORT } = require("./config");
const blogsRouter = require("./src/routers/blog.router");
const usersRouter = require("./src/routers/users.router");
const categoriesRouter = require("./src/routers/categories.router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/blogs", blogsRouter);
app.use("/categories", categoriesRouter);

// Error Handler
app.use((error, req, res, next) => {
  const message = error.message;
  const statusCode = error.statusCode || 422;
  if (statusCode < 500) {
    res.status(statusCode).json({ ...error, message });
  } else {
    res.json({ ...error, message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
