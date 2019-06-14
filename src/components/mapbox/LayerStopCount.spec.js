import LayerStopCount from "./LayerStopCount";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("mapbox-gl");

describe("LayerStopCount.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LayerStopCount, {
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

  it("adds the layer to the map when created", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map.addLayer).toBeCalled();
  });

  it("removes the layer from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeLayer).toBeCalledWith("stop-count");
  });
});
