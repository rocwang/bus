import ControlGeolocate from "./ControlGeolocate";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";

jest.mock("mapbox-gl");

describe("ControlGeolocate.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ControlGeolocate, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map())
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("adds the control to the map when created", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.control).toBeTruthy();
    expect(wrapper.vm.map.addControl).toBeCalledWith(wrapper.vm.control);
  });

  it("removes the control from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeControl).toBeCalledWith(wrapper.vm.control);
  });
});
