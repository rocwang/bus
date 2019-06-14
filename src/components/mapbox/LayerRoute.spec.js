import LayerRoute from "./LayerRoute";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";
import colors from "../../__mocks__/colors";

jest.mock("mapbox-gl");

describe("LayerRoute.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LayerRoute, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map()),
        colors
      },
      propsData: {
        routePattern: "12345",
        index: 0
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("has line Colors", async () => {
    expect(wrapper.vm.lineColors).toEqual(expect.any(Array));
  });

  it("adds the layer to the map when created", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map.addLayer).toBeCalled();
  });

  it("removes the layer from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeLayer).toBeCalledWith("12345");
  });
});
