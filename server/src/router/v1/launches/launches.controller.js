const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../../models/launches.model");
const {
  res200,
  res201,
  res400,
  res404,
  res500,
} = require("../../../utils/responses");

function httpGetAllLaunches(req, res) {
  return res200(req, res, getAllLaunches());
}

function httpPostNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res400(req, res, null, "missing required launch property");
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res400(req, res, null, "Invalid launch date");
  }
  addNewLaunch(launch);
  res201(req, res, launch, "New Launches created!");
}

function httpDeleteAbortLaunch(req, res) {
  const launchId = Number(req.query.id);

  if (isNaN(launchId)) {
    return res400(req, res, null, "id is invalid");
  }

  if (!existsLaunchWithId(launchId)) {
    return res404(req, res, null, "Launch not found");
  }

  const aborted = abortLaunchById(launchId);
  return res200(req, res, aborted, "Mission Aborted");
}

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteAbortLaunch,
};
