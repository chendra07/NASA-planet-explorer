const {
  getAllLaunches,
  scheduleNewLaunch,
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

async function httpGetAllLaunches(req, res) {
  return res200(req, res, await getAllLaunches());
}

async function httpPostNewLaunch(req, res) {
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

  try {
    await scheduleNewLaunch(launch);
    console.log("launch: ", launch);
    return res201(req, res, launch, "New Launches created!");
  } catch (error) {
    console.error(error);
    return res500(
      req,
      res,
      null,
      `Unable to insert new launch to database | ${error}`
    );
  }
}

async function httpDeleteAbortLaunch(req, res) {
  const launchId = Number(req.query.id);

  if (isNaN(launchId)) {
    return res400(req, res, null, "id is invalid");
  }

  const existLaunch = await existsLaunchWithId(launchId);

  if (!existLaunch) {
    return res404(req, res, null, "Launch not found");
  }
  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res400(req, res, null, `Unable to delete launch mission | ${error}`);
  }
  return res200(req, res, { ok: true }, "Mission Aborted");
}

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteAbortLaunch,
};
