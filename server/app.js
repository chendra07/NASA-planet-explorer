/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

//routes
const indexRouter = require("./src/router");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(indexRouter);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
