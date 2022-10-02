import services from "../utils/services";

async function httpGetPlanets() {
  const response = await services
    .Get("http://localhost:8000", "v1/planets")
    .then((resp) => {
      console.log("data: ", resp);
      return resp.data.planets;
    });

  return response;
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
