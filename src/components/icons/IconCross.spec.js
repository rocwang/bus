import { mount } from "@vue/test-utils";
import IconCross from "./IconCross";
import colors from "../__fixtures__/colors";

describe("IconCross.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(IconCross, {
      provide: {
        colors
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a stroke color", () => {
    const wrapper = mount(IconCross, {
      provide: {
        colors
      },
      propsData: {
        color: colors.red
      }
    });
    expect(wrapper.find("path").attributes("stroke")).toBe(colors.red);
  });
});
