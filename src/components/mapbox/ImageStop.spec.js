import ImageStop from "./ImageStop";
import { mount } from "@vue/test-utils";
import mapboxgl from "mapbox-gl";

jest.mock("mapbox-gl");

describe("ImageStop.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ImageStop, {
      provide: {
        mapPromise: Promise.resolve(new mapboxgl.Map())
      }
    });
  });

  it("contains a Mapbox instance", async () => {
    await wrapper.vm.mapPromise;
    expect(wrapper.vm.map).toBeTruthy();
  });

  it("adds the image to the map when created", async () => {
    await wrapper.vm.mapPromise;
    await wrapper.vm.image;
    expect(wrapper.vm.image).toBeTruthy();
    expect(wrapper.vm.map.loadImage).toBeCalled();
    expect(wrapper.vm.map.addImage).toBeCalledWith("stop", expect.any(Object));
  });

  it("removes the image from the map when destroyed", async () => {
    await wrapper.vm.mapPromise;
    wrapper.destroy();
    expect(wrapper.vm.map.removeImage).toBeCalledWith("stop");
  });
});
