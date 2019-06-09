import fetchMock from "fetch-mock";
import {
  getStopNameById,
  getTripsByStop,
  getNexTripsByStopRouteItems,
  getTripsByStopAndRoute,
  getTripsByStopAndTrip,
  getRoutesByStopRouteItems,
  getRoutesByStop,
  getRoutesByStopAndShortName,
  getRoutesByStopAndTrip
} from "./gtfs";

describe("Function getStopNameById()", () => {
  it("returns an empty stop name when no stop code passed in", async () => {
    fetchMock.once("*", 200);
    const stopName = await getStopNameById();

    expect(stopName).toEqual([{ stop_name: "" }]);
    expect(fetchMock.called()).toBe(false);

    fetchMock.reset();
  });

  it("returns a stop name by a stop code", async () => {
    const expectedStopName = "STOP_NAME";

    fetchMock.once("*", JSON.stringify(expectedStopName));
    const stopName = await getStopNameById("1234");
    fetchMock.reset();

    expect(stopName).toBe(expectedStopName);
  });
});

describe("Function getTripsByStop()", () => {
  it("returns an empty array when no stop code passed in", async () => {
    fetchMock.once("*", 200);
    const trips = await getTripsByStop();

    expect(trips).toEqual([]);
    expect(fetchMock.called()).toBe(false);

    fetchMock.reset();
  });

  it("returns an array of trips by a stop code", async () => {
    const expectedTrips = [
      {
        trip_id: "ABCD",
        trip_headsign: "Albany",
        departure_time: "14:57:00"
      }
    ];

    fetchMock.once("*", expectedTrips);
    const trips = await getTripsByStop("1234");
    fetchMock.reset();

    expect(trips).toEqual(expectedTrips);
  });
});

describe("Function getNexTripsByStopRouteItems()", () => {
  it("returns an empty array when no stop routes passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getNexTripsByStopRouteItems();
    expect(trips).toEqual([]);

    trips = await getNexTripsByStopRouteItems([]);
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by an array of stop and routes", async () => {
    const expectedTrips = [
      {
        trip_id: "ABCD",
        trip_headsign: "Albany",
        departure_time: "14:57:00",
        stop_code: "1234",
        route_short_name: "NX1"
      }
    ];

    fetchMock.once("*", expectedTrips);
    const trips = await getNexTripsByStopRouteItems([
      {
        stopCode: "1234",
        routeShortName: "NX1"
      }
    ]);
    fetchMock.reset();

    expect(trips).toEqual(expectedTrips);
  });
});

describe("Function getTripsByStopAndRoute()", () => {
  it("returns an empty array when no stop code or route short name passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getTripsByStopAndRoute();
    expect(trips).toEqual([]);

    trips = await getTripsByStopAndRoute("1234");
    expect(trips).toEqual([]);

    trips = await getTripsByStopAndRoute(undefined, "NX1");
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by a pair of stop code and route short name", async () => {
    const expectedTrips = [
      {
        trip_id: "ABCD",
        trip_headsign: "Albany",
        departure_time: "14:57:00"
      }
    ];

    fetchMock.once("*", expectedTrips);
    const trips = await getTripsByStopAndRoute("1234", "NX1");
    fetchMock.reset();

    expect(trips).toEqual(expectedTrips);
  });
});

describe("Function getTripsByStopAndTrip()", () => {
  it("returns an empty array when no stop code or trip ID passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getTripsByStopAndTrip();
    expect(trips).toEqual([]);

    trips = await getTripsByStopAndTrip("1234");
    expect(trips).toEqual([]);

    trips = await getTripsByStopAndTrip(undefined, "1234");
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by a pair of stop code and trip ID", async () => {
    const expectedTrips = [
      {
        trip_id: "ABCD",
        trip_headsign: "Albany",
        departure_time: "14:57:00"
      }
    ];

    fetchMock.once("*", expectedTrips);
    const trips = await getTripsByStopAndTrip("1234", "ABCD");
    fetchMock.reset();

    expect(trips).toEqual(expectedTrips);
  });
});

describe("Function getRoutesByStopRouteItems()", () => {
  it("returns an empty array when no stop routes passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getRoutesByStopRouteItems();
    expect(trips).toEqual([]);

    trips = await getRoutesByStopRouteItems([]);
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by an array of stop route item", async () => {
    const expectedRoutes = [
      {
        route_id: "ABCD",
        route_short_name: "NX1"
      }
    ];

    fetchMock.once("*", expectedRoutes);
    const trips = await getRoutesByStopRouteItems([
      {
        stopCode: "1234",
        routeShortName: "NX1"
      }
    ]);
    fetchMock.reset();

    expect(trips).toEqual(expectedRoutes);
  });
});

describe("Function getRoutesByStop()", () => {
  it("returns an empty array when no stop code passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getRoutesByStop();
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by stop code", async () => {
    const expectedRoutes = [
      {
        route_id: "ABCD",
        route_short_name: "NX1"
      }
    ];

    fetchMock.once("*", expectedRoutes);
    const trips = await getRoutesByStop("1234");
    fetchMock.reset();

    expect(trips).toEqual(expectedRoutes);
  });
});

describe("Function getRoutesByStopAndShortName()", () => {
  it("returns an empty array when no stop code or route short name passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getRoutesByStopAndShortName();
    expect(trips).toEqual([]);

    trips = await getRoutesByStopAndShortName("1234");
    expect(trips).toEqual([]);

    trips = await getRoutesByStopAndShortName(undefined, "NX1");
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by a pair of stop code and route short name", async () => {
    const expectedRoutes = [
      {
        route_id: "ABCD",
        route_short_name: "NX1"
      }
    ];

    fetchMock.once("*", expectedRoutes);
    const trips = await getRoutesByStopAndShortName("1234", "NX1");
    fetchMock.reset();

    expect(trips).toEqual(expectedRoutes);
  });
});

describe("Function getRoutesByStopAndTrip()", () => {
  it("returns an empty array when no stop code or trip ID passed in", async () => {
    fetchMock.once("*", 200);

    let trips = await getRoutesByStopAndTrip();
    expect(trips).toEqual([]);

    trips = await getRoutesByStopAndTrip("1234");
    expect(trips).toEqual([]);

    trips = await getRoutesByStopAndTrip(undefined, "ABCD");
    expect(trips).toEqual([]);

    expect(fetchMock.called()).toBe(false);
    fetchMock.reset();
  });

  it("returns an array of trips by a pair of stop code and trip ID", async () => {
    const expectedRoutes = [
      {
        route_id: "ABCD",
        route_short_name: "NX1"
      }
    ];

    fetchMock.once("*", expectedRoutes);
    const trips = await getRoutesByStopAndTrip("1234", "5678");
    fetchMock.reset();

    expect(trips).toEqual(expectedRoutes);
  });
});
