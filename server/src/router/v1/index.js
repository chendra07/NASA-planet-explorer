const express = require("express");
const v1Router = express.Router();

//router
const planets = require("./planets/planets.router");
const launches = require("./launches/launches.router");

v1Router.use("/planets", planets);
v1Router.use("/launches", launches);

module.exports = v1Router;
