import { mount } from "@vue/test-utils";
import Icon from "./index";
import IconArrow from "./IconArrow";
import IconBus from "./IconBus";
import IconCross from "./IconCross";
import IconEdit from "./IconEdit";
import IconEmptyStar from "./IconEmptyStar";
import IconFullStar from "./IconFullStar";
import IconShip from "./IconShip";
import IconTrain from "./IconTrain";

describe("Icon.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Icon, {
      propsData: {
        color: "red",
        direction: "down",
        name: "Arrow"
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a color", () => {
    expect(wrapper.attributes("style")).toMatch(/color:.*/);
  });

  it("has a direction", () => {
    expect(wrapper.classes()).toContain(wrapper.vm.$style.down);
  });

  it("has path components that match the snapshots", () => {
    [
      IconArrow,
      IconBus,
      IconCross,
      IconEdit,
      IconEmptyStar,
      IconFullStar,
      IconShip,
      IconTrain
    ].forEach(pathComponents => {
      expect(mount(pathComponents).element).toMatchSnapshot(
        pathComponents.name
      );
    });
  });
});
