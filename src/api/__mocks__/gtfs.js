const routes = [
  { route_id: "12345ABCDE", route_short_name: "NX1" }
  // { route_id: "567890XYZ", route_short_name: "NX2" }
];
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

export async function getShapeByTrip() {
  return [
    { shape_pt_lat: -36.84346, shape_pt_lon: 174.76561 },
    { shape_pt_lat: -36.84349, shape_pt_lon: 174.76569 },
    { shape_pt_lat: -36.8433, shape_pt_lon: 174.76577 },
    { shape_pt_lat: -36.84315, shape_pt_lon: 174.76576 },
    { shape_pt_lat: -36.84309, shape_pt_lon: 174.76576 },
    { shape_pt_lat: -36.84306, shape_pt_lon: 174.76575 },
    { shape_pt_lat: -36.84304, shape_pt_lon: 174.76575 },
    { shape_pt_lat: -36.84301, shape_pt_lon: 174.76573 },
    { shape_pt_lat: -36.84299, shape_pt_lon: 174.76572 },
    { shape_pt_lat: -36.84296, shape_pt_lon: 174.76569 }
  ];
}
