import LayerStopClusters from "./LayerStopClusters";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("mapbox-gl");

describe("LayerStopClusters.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LayerStopClusters, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map()),
        colors,
      },
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
    expect(wrapper.vm.map.removeLayer).toBeCalledWith("stop-clusters");
  });

  it("handle stop cluster click", async () => {
    await wrapper.vm.mapPromise;
    wrapper.vm.map.emit("click-stop-clusters", { point: { x: 0, y: 0 } });
    expect(wrapper.vm.map.queryRenderedFeatures).toBeCalled();
    expect(wrapper.vm.map.getSource).toBeCalled();
    expect(wrapper.vm.map.easeTo).toBeCalled();
  });
});
