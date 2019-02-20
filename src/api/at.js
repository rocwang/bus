import config from "../config";

function callApi(request) {
  if (typeof request === "string") {
    request = `https://api.at.govt.nz/v2/${request}`;
  }

  return fetch(request, {
    headers: { "Ocp-Apim-Subscription-Key": config.aucklandTransportApiKey }
  })
    .then(response => response.json())
    .then(json => json.response);
}

export function getVehiclePositions(tripId) {
  return callApi(`public/realtime/vehiclelocations?tripid=${tripId}`);
}

export function getStopInfoByStopCode(stopCode) {
  return callApi(`gtfs/stops/stopinfo/${stopCode}`);
}
