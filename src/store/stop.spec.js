import { first, take } from "rxjs/operators";

jest.mock("../api/gtfs");

beforeEach(() => {
  jest.resetModules();
});

describe("stopCode$", () => {
  it("is empty be default", async () => {
    const { stopCode$ } = require("./stop");
    const result = await stopCode$.pipe(first()).toPromise();
    expect(result).toBe("");
  });

  it("can be updated by actionViewStop$", async () => {
    const { stopCode$ } = require("./stop");
    const { actionViewStop$ } = require("./actions");
    const result = stopCode$.pipe(take(2)).toPromise();
    actionViewStop$.next("1234");
    expect(await result).toBe("1234");
  });

  it("can be updated by actionViewRoute$", async () => {
    const { stopCode$ } = require("./stop");
    const { actionViewRoute$ } = require("./actions");
    const result = stopCode$.pipe(take(2)).toPromise();
    actionViewRoute$.next({ stopCode: "1234", routeShortName: "NX1" });
    expect(await result).toBe("1234");
  });

  it("can be updated by actionViewTrip$", async () => {
    const { stopCode$ } = require("./stop");
    const { actionViewTrip$ } = require("./actions");
    const result = stopCode$.pipe(take(2)).toPromise();
    actionViewTrip$.next({ stopCode: "1234", tripId: "1234" });
    expect(await result).toBe("1234");
  });
});

describe("stopName$", () => {
  it("is empty be default", async () => {
    const { stopName$ } = require("./stop");
    const result = await stopName$.pipe(first()).toPromise();
    expect(result).toEqual("");
  });

  it("will be updated when stopCode$ is updated", async () => {
    const { stopName$ } = require("./stop");
    const { actionViewStop$ } = require("./actions");
    const result = stopName$.pipe(take(2)).toPromise();
    actionViewStop$.next("1234");
    expect(await result).toBe("ABCD");
  });
});
