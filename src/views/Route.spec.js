import { first } from "rxjs/operators";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRx from "vue-rx";

jest.mock("../api/gtfs");
jest.mock("../api/gtfsRealtime");

describe("Route.vue", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetModules();

    const localVue = createLocalVue();
    localVue.use(VueRx);

    const Route = require("./Route").default;
    wrapper = shallowMount(Route, {
      localVue,
      mocks: {
        $route: {
          params: {
            stopCode: "1234",
            shortName: "NX1"
          }
        }
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("triggers the view route action when created", () => {
    expect(wrapper.vm.stopCode).toBe("1234");
    expect(wrapper.vm.tripsWithVehicles).toEqual([
      {
        trip_id: "1234",
        trip_headsign: "Albany",
        departure_time: "18:23:00",
        vehicle: {
          trip: {
            trip_id: "1234",
            route_id: "08204-20190522094814_v80.15",
            start_time: "16:25:00",
            schedule_relationship: 0
          },
          vehicle: { id: "2CC7" },
          position: { latitude: -36.852667, longitude: 174.765633 },
          timestamp: 1560054213,
          occupancy_status: 0
        }
      }
    ]);
    expect(wrapper.vm.favourites).toEqual([]);
  });

  it("triggers the view route action before route update", async () => {
    const { actionViewRoute$ } = require("../store/actions");
    const result = actionViewRoute$.pipe(first()).toPromise();
    const next = jest.fn();
    wrapper.vm.$options.beforeRouteUpdate(
      {
        params: { stopCode: "1234", shortName: "NX1" }
      },
      undefined,
      next
    );
    expect(next).toBeCalled();
    expect(await result).toEqual({ stopCode: "1234", routeShortName: "NX1" });
  });

  it("triggers the view route action before route leave", async () => {
    const { actionViewRoute$ } = require("../store/actions");
    const result = actionViewRoute$.pipe(first()).toPromise();
    const next = jest.fn();
    wrapper.vm.$options.beforeRouteLeave(undefined, undefined, next);
    expect(next).toBeCalled();
    expect(await result).toEqual({ stopCode: "", routeShortName: "" });
  });
});
