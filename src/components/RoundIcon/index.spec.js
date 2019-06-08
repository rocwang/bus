import { mount } from "@vue/test-utils";
import RoundIcon from "./index";
import RoundIconFullStar from "./RoundIconFullStar";
import RoundIconMap from "./RoundIconMap";
import RoundIconRoute from "./RoundIconRoute";
import RoundIconStop from "./RoundIconStop";
import RoundIconStreetView from "./RoundIconStreetView";

describe("Icon.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(RoundIcon, {
      propsData: {
        bg: "green",
        color: "red",
        direction: "down",
        name: "Map"
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a background", () => {
    expect(wrapper.find("path").attributes("fill")).toBe("green");
  });

  it("has a color", () => {
    expect(
      wrapper
        .findAll("path")
        .at(1)
        .attributes("style")
    ).toMatch(/color:.*/);
  });

  it("has a direction", () => {
    expect(wrapper.classes()).toContain(wrapper.vm.$style.down);
  });

  it("has path components that match the snapshots", () => {
    [
      RoundIconFullStar,
      RoundIconMap,
      RoundIconRoute,
      RoundIconStop,
      RoundIconStreetView
    ].forEach(pathComponents => {
      expect(mount(pathComponents).element).toMatchSnapshot(
        pathComponents.name
      );
    });
  });
});
