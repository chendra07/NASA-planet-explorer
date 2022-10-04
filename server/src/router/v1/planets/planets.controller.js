const { res200 } = require("../../../utils/responses");
const { getAllPlanets } = require("../../../models/planets.model");

function httpGetAllPlanets(req, res) {
  res200(req, res, getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
