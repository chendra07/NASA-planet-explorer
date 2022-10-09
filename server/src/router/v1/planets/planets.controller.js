const { res200 } = require("../../../utils/responses");
const { getAllPlanets } = require("../../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  res200(req, res, await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
