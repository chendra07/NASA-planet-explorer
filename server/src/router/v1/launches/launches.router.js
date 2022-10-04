const express = require("express");
const {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostNewLaunch);
launchesRouter.delete("/", httpDeleteAbortLaunch);

module.exports = launchesRouter;
