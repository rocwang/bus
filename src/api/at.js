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

export function getStops(location) {
  return callApi(
    `gtfs/stops/geosearch?lat=${location.lat}&lng=${location.lng}&distance=1000`
  );
}

export function getStopByStopCode(stopCode) {
  return callApi(`gtfs/stops/stopCode/${stopCode}`);
}

export function getRoutesByStop(stopId) {
  return callApi(`gtfs/routes/stopid/${stopId}`);
}

export function getTripsByRoute(routeId) {
  return callApi(`gtfs/trips/routeid/${routeId}`);
}

export function getStopTimesByStop(stopId) {
  return callApi(`gtfs/stopTimes/stopId/${stopId}`);
}

export function getStopTimesByTrip(tripId) {
  return callApi(`gtfs/stopTimes/tripId/${tripId}`);
}

export function getVehiclePositions(tripId) {
  return callApi(`public/realtime/vehiclelocations?tripid=${tripId}`);
}

export function getSharpeByTrip(tripId) {
  return callApi(`gtfs/shapes/tripId/${tripId}`);
}

export function getStopInfoByStopCode(stopCode) {
  return callApi(`gtfs/stops/stopinfo/${stopCode}`);
}
