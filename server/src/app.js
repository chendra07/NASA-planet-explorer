const express = require("express");
const cors = require("cors");

//routes
const indexRouter = require("./router");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(indexRouter);

module.exports = app;
