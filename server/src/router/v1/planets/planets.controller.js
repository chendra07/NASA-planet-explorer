const { res200 } = require("../../../utils/responses");
const planetsModel = require("../../../models/planets.model");

function getAllPlanets(req, res) {
  res200(req, res, planetsModel);
}

module.exports = {
  getAllPlanets,
};
