const routes = [{ route_id: "12345ABCDE", route_short_name: "NX1" }];
const trips = [
  {
    trip_id: "1234",
    trip_headsign: "Albany",
    departure_time: "18:23:00"
  }
];

export async function getRoutesByStopRouteItems() {
  return routes;
}

export async function getRoutesByStopAndTrip() {
  return routes;
}

export async function getRoutesByStopAndShortName() {
  return routes;
}

export async function getRoutesByStop() {
  return routes;
}

export async function getStopNameById(stopCode) {
  if (stopCode) {
    return [{ stop_name: "ABCD" }];
  } else {
    return [{ stop_name: "" }];
  }
}

export async function getNexTripsByStopRouteItems() {
  return [
    {
      trip_id: "1234",
      trip_headsign: "Albany",
      departure_time: "18:23:00",
      stop_code: "1234",
      route_short_name: "NX1"
    }
  ];
}

export async function getTripsByStopAndTrip() {
  return trips;
}

export async function getTripsByStopAndRoute() {
  return trips;
}

export async function getTripsByStop() {
  return trips;
}
