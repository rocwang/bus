import LayerStops from "./LayerStops";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("mapbox-gl");

describe("LayerStops.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LayerStops, {
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
    expect(wrapper.vm.map.setFilter).toBeCalled();
    expect(wrapper.vm.map.setLayerZoomRange).toBeCalled();
  });

  it("removes the layer from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeLayer).toBeCalledWith("stops");
  });

  it("toggles the current stop when stop code changes", async () => {
    await wrapper.vm.mapPromise;
    wrapper.setProps({ stopCode: "1234" });
    expect(wrapper.vm.map.setFilter).toBeCalledTimes(2);
    expect(wrapper.vm.map.setLayerZoomRange).toBeCalledTimes(2);
  });

  it("can handle the click events", async () => {
    await wrapper.vm.mapPromise;
    wrapper.vm.map.emit("click-stops", {
      features: [
        {
          properties: { stopCode: "1234" },
          geometry: { coordinates: { x: 0, y: 0 } },
        },
      ],
    });
    expect(wrapper.vm.map.easeTo).toBeCalled();
    expect(wrapper.emitted("click")).toEqual([["1234"]]);
  });

  it("can handle the mouseenter events", async () => {
    await wrapper.vm.mapPromise;
    wrapper.vm.map.emit("mouseenter-stops");
    expect(wrapper.vm.map.getCanvas).toBeCalled();
  });

  it("can handle the mouseleave events", async () => {
    await wrapper.vm.mapPromise;
    wrapper.vm.map.emit("mouseleave-stops");
    expect(wrapper.vm.map.getCanvas).toBeCalled();
  });
});
