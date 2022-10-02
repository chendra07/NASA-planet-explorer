const express = require("express");

const v1Router = express.Router();
//router
const planets = require("./planets/planets.router");

v1Router.use("/planets", planets);

module.exports = v1Router;
