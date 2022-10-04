import Services from "../utils/services";

const baseUrl = "http://localhost:8000";

async function httpGetPlanets() {
  const response = await Services.Get(baseUrl, "v1/planets")
    .then((resp) => {
      console.log("data (planets): ", resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return response;
}

async function httpGetLaunches() {
  const response = await Services.Get(baseUrl, "v1/launches")
    .then((resp) => {
      return resp.data.sort((a, b) => {
        return a.flightNumber - b.flightNumber;
      });
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return response;
}

async function httpSubmitLaunch(launch) {
  const response = await Services.Post(baseUrl, "v1/launches", launch)
    .then((resp) => {
      console.log(resp);
      return resp;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return response;
}

async function httpAbortLaunch(id) {
  const response = Services.Delete(baseUrl, `v1/launches`, { id })
    .then((resp) => {
      console.log(resp);
      return resp;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return response;
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
