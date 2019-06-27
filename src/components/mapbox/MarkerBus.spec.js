import MarkerBus from "./MarkerBus";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("../../api/gtfs");
jest.mock("mapbox-gl");

describe("MarkerBus.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MarkerBus, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map()),
        colors
      },
      propsData: {
        vehicle: {
          trip: {
            trip_id: "1234",
            route_id: "08204-20190522094814_v80.15",
            start_time: "16:25:00",
            schedule_relationship: 0
          },
          vehicle: { id: "2CC7" },
          position: {
            latitude: -36.852667,
            longitude: 174.765633,
            bearing: 240
          },
          timestamp: 1560054213,
          occupancy_status: 0
        }
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("adds the marker to the map when created", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.marker.addTo).toBeCalledWith(wrapper.vm.map);
  });

  it("removes the marker from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.marker.remove).toBeCalled();
  });

  it.skip("add more unit test", () => {});
});
