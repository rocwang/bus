import SourceStops from "./SourceStops";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("mapbox-gl");

describe("SourceStops.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SourceStops, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map()),
        colors
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("adds the source to the map when created", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map.addSource).toBeCalled();
  });

  it("removes the source from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeSource).not.toBeCalledWith("stops");
  });
});
