import AxiosRequest from "../services/axiosRequest";

const baseUrl = "http://localhost:8000";

async function httpGetPlanets() {
  const response = await AxiosRequest.Get(baseUrl, "v1/planets/all")
    .then((resp) => {
      console.log("data (planets): ", resp.data);
      return resp.data.data;
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
}

async function httpGetLaunches() {
  const response = await AxiosRequest.Get(baseUrl, "v1/launches/all")
    .then((resp) => {
      return resp.data.data.sort((a, b) => {
        return a.flightNumber - b.flightNumber;
      });
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
}

async function httpSubmitLaunch(launch) {
  const response = await AxiosRequest.Post(baseUrl, "v1/launches", launch)
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
}

async function httpAbortLaunch(id) {
  const response = AxiosRequest.Delete(baseUrl, `v1/launches`, { id })
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
