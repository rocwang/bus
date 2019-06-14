import Mapbox from "./Mapbox";
import { shallowMount } from "@vue/test-utils";
import config from "../../config";

jest.mock("mapbox-gl");

describe("Mapbox.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Mapbox, {
      provide: {
        config
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("removes the Mapbox instance when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.remove).toBeCalled();
  });

  it("has props: stopCode, routePatterns and vehicles", () => {
    expect(wrapper.vm.stopCode).toBe("");
    expect(wrapper.vm.routePatterns).toEqual([]);
    expect(wrapper.vm.vehicles).toEqual([]);
  });

  it("provides the mapPromise", () => {
    expect(wrapper.vm.$options.provide().mapPromise).toBe(
      wrapper.vm.mapPromise
    );
  });
});
