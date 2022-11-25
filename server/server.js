// const http = require("http");
const app = require("./app");
// const express = require("express");
require("dotenv").config();
const { mongoConnect } = require("./src/services/mongo");
const { loadPlanetsData } = require("./src/models/planets.model");
const { loadLaunchesData } = require("./src/models/launches.model");

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000;
// const server = http.createServer(app);
// const server = express();

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  app.listen(PORT, () => {
    console.log("listening on port: ", PORT);
  });
}

startServer();
