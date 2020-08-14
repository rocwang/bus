import { first, take } from "rxjs/operators";

jest.mock("../api/gtfs");
jest.mock("../api/gtfsRealtime");

beforeEach(() => {
  jest.resetModules();
});

describe("trips$", () => {
  it("is empty be default", async () => {
    const { trips$ } = require("./trips");
    const result = await trips$.pipe(first()).toPromise();
    expect(result).toEqual([]);
  });

  it("can be updated by actionViewFavourites$", async () => {
    const { trips$ } = require("./trips");
    const { actionViewFavourites$ } = require("./actions");
    const result = trips$.pipe(take(2)).toPromise();
    actionViewFavourites$.next();
    expect(await result).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
        route_short_name: "NX1",
        stop_code: "1234",
      },
    ]);
  });

  it("can be updated by actionViewTrip$", async () => {
    const { trips$ } = require("./trips");
    const { actionViewTrip$ } = require("./actions");
    const result = trips$.pipe(take(2)).toPromise();
    actionViewTrip$.next({ stopCode: "1234", tripId: "1234" });
    expect(await result).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
      },
    ]);
  });

  it("can be updated by actionViewRoute$", async () => {
    const { trips$ } = require("./trips");
    const { actionViewRoute$ } = require("./actions");
    const result = trips$.pipe(take(2)).toPromise();
    actionViewRoute$.next({ stopCode: "1234", routeShortName: "NX1" });
    expect(await result).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
      },
    ]);
  });

  it("can be updated by actionViewStop$", async () => {
    const { trips$ } = require("./trips");
    const { actionViewStop$ } = require("./actions");
    const result = trips$.pipe(take(2)).toPromise();
    actionViewStop$.next("1234");
    expect(await result).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
      },
    ]);
  });
});

describe("vehicles$", () => {
  it("is empty be default", async () => {
    const { vehicles$ } = require("./trips");
    const result = await vehicles$.pipe(take(1)).toPromise();
    expect(result).toEqual([]);
  });

  it("will be updated when trips$ is updated", async () => {
    const { vehicles$ } = require("./trips");
    const { actionViewTrip$ } = require("./actions");
    const result = vehicles$.pipe(take(2)).toPromise();
    actionViewTrip$.next({ stopCode: "1234", tripId: "1234" });
    expect(await result).toEqual([
      {
        trip: {
          trip_id: "1234",
          route_id: "08204-20190522094814_v80.15",
          start_time: "16:25:00",
          schedule_relationship: 0,
        },
        vehicle: { id: "2CC7" },
        position: { latitude: -36.852667, longitude: 174.765633 },
        timestamp: 1560054213,
        occupancy_status: 0,
      },
    ]);
  });
});

describe("tripsWithVehicles$", () => {
  it("is empty be default", async () => {
    const { tripsWithVehicles$ } = require("./trips");
    const result = await tripsWithVehicles$.pipe(first()).toPromise();
    expect(result).toEqual([]);
  });

  it("will be updated when trips$ or vehicles$ is updated", async () => {
    const { tripsWithVehicles$ } = require("./trips");
    const { actionViewTrip$ } = require("./actions");
    const result = tripsWithVehicles$.pipe(take(3)).toPromise();
    actionViewTrip$.next({ stopCode: "1234", tripId: "1234" });
    expect(await result).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
        vehicle: {
          trip: {
            trip_id: "1234",
            route_id: "08204-20190522094814_v80.15",
            start_time: "16:25:00",
            schedule_relationship: 0,
          },
          vehicle: { id: "2CC7" },
          position: { latitude: -36.852667, longitude: 174.765633 },
          timestamp: 1560054213,
          occupancy_status: 0,
        },
      },
    ]);
  });
});

describe("favouritesWithTrips$", () => {
  it("is empty be default", async () => {
    const { favouritesWithTrips$ } = require("./trips");
    const result = await favouritesWithTrips$.pipe(first()).toPromise();
    expect(result).toEqual([]);
  });

  it("will be updated when favourites$ or tripsWithVehicles$ is updated", async () => {
    const { favouritesWithTrips$ } = require("./trips");
    const {
      actionViewFavourites$,
      actionAddToFavourites$,
    } = require("./actions");

    const result = favouritesWithTrips$.pipe(take(2)).toPromise();

    actionAddToFavourites$.next({ stopCode: "1234", routeShortName: "NX1" });
    actionViewFavourites$.next();

    expect(await result).toEqual([
      {
        name: "NX1 at 1234",
        stopCode: "1234",
        routeShortName: "NX1",
        trip: {
          trip_id: "1234",
          trip_headsign: "Albany",
          departure_time: "18:23:00",
          stop_code: "1234",
          route_short_name: "NX1",
          vehicle: {
            trip: {
              trip_id: "1234",
              route_id: "08204-20190522094814_v80.15",
              start_time: "16:25:00",
              schedule_relationship: 0,
            },
            vehicle: { id: "2CC7" },
            position: { latitude: -36.852667, longitude: 174.765633 },
            timestamp: 1560054213,
            occupancy_status: 0,
          },
        },
      },
    ]);
  });
});
