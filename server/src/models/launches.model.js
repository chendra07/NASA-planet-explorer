const axiosRequest = require("../services/axiosRequest");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

const SPACEX_API_URL = "https://api.spacexdata.com";
const DEFAULT_FLIGHT_NUMBER = 100;

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber"); // "-" -> descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    { ...launch },
    {
      upsert: true,
    }
  );
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function getLatestLaunch() {
  const response = await axiosRequest.Get(SPACEX_API_URL, "v4/launches/latest");
  const launchDoc = response.data;
  const customers = launchDoc["payloads"].flatMap((payload) => {
    payload["customers"];
  });

  const launch = {
    flightNumber: launchDoc["flight_number"],
    mission: launchDoc["name"],
    rocket: launchDoc["rocket"]["name"] ?? "N/A",
    launchDate: launchDoc["date_local"],
    customers: customers,
    upcoming: launchDoc["upcoming"],
    success: launchDoc["success"],
  };

  if (response.status !== 200) {
    console.error("Problem downloading launches");
    throw new Error("Launch data downlaod failed");
  }

  return launch;
}

async function populatLaunches() {
  const response = await axiosRequest
    .Post(SPACEX_API_URL, "v4/launches/query", {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    })
    .catch((error) => {
      throw new Error(`[populate launches] ${error}`);
    });
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"] ?? "N/A",
      launchDate: launchDoc["date_local"],
      customers: launchDoc["payloads"][0]?.customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };

    // console.log("launch: ", launch.customers);

    // console.log(`${launch.flightNumber} - ${launch.mission}`);

    await saveLaunch(launch);
  }
}

//=============================================

async function getAllLaunches(limit, skip) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 }) //-1 = Desc & 1 = Asc
    .skip(skip)
    .limit(limit);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planets found!");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: ["SpaceY"],
  });

  // console.log("new flight: ", newFlightNumber);

  await saveLaunch(newLaunch);
}

async function loadLaunchesData() {
  try {
    const latestSpaceXLaunch = await getLatestLaunch();
    const latestLaunch = await findLaunch({
      flightNumber: latestSpaceXLaunch.flightNumber,
      mission: latestSpaceXLaunch.mission,
    });

    if (latestLaunch) {
      console.log("Launch data loaded");
    } else {
      await populatLaunches();
    }
  } catch (error) {
    throw new Error(`[Load Launches Data] ${error}`);
  }
}

module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchesData,
};
