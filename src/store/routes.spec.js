import { first, take } from "rxjs/operators";

jest.mock("../api/gtfs");

beforeEach(() => {
  jest.resetModules();
});

describe("route$", () => {
  it("is empty be default", async () => {
    const { routes$ } = require("./routes");
    const result = await routes$.pipe(first()).toPromise();
    expect(result).toEqual([]);
  });

  it("can be updated by actionViewFavourites$", async () => {
    const { routes$ } = require("./routes");
    const { actionViewFavourites$ } = require("./actions");
    const result = routes$.pipe(take(2)).toPromise();
    actionViewFavourites$.next();
    expect(await result).toEqual([
      { route_id: "12345ABCDE", route_short_name: "NX1" }
    ]);
  });

  it("can be updated by actionViewTrip$", async () => {
    const { routes$ } = require("./routes");
    const { actionViewTrip$ } = require("./actions");
    const result = routes$.pipe(take(2)).toPromise();
    actionViewTrip$.next({ stopCode: "1234", tripId: "1234" });
    expect(await result).toEqual([
      { route_id: "12345ABCDE", route_short_name: "NX1" }
    ]);
  });

  it("can be updated by actionViewRoute$", async () => {
    const { routes$ } = require("./routes");
    const { actionViewRoute$ } = require("./actions");
    const result = routes$.pipe(take(2)).toPromise();
    actionViewRoute$.next({ stopCode: "1234", routeShortName: "NX1" });
    expect(await result).toEqual([
      { route_id: "12345ABCDE", route_short_name: "NX1" }
    ]);
  });

  it("can be updated by actionViewStop$", async () => {
    const { routes$ } = require("./routes");
    const { actionViewStop$ } = require("./actions");
    const result = routes$.pipe(take(2)).toPromise();
    actionViewStop$.next("1234");
    expect(await result).toEqual([
      { route_id: "12345ABCDE", route_short_name: "NX1" }
    ]);
  });
});

describe("routeShortNamesByStop$", () => {
  it("is empty be default", async () => {
    const { routeShortNamesByStop$ } = require("./routes");
    const result = await routeShortNamesByStop$.pipe(first()).toPromise();
    expect(result).toEqual([]);
  });

  it("will be updated when routes$ is updated", async () => {
    const { routeShortNamesByStop$ } = require("./routes");
    const { actionViewRoute$ } = require("./actions");
    const result = routeShortNamesByStop$.pipe(take(2)).toPromise();
    actionViewRoute$.next({ stopCode: "1234", routeShortName: "NX1" });
    expect(await result).toEqual(["NX1"]);
  });
});
