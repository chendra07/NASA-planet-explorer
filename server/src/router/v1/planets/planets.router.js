const express = require("express");
const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/all", httpGetAllPlanets);

module.exports = planetsRouter;
