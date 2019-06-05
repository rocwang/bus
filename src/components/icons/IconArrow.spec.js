import { mount } from "@vue/test-utils";
import IconArrow from "./IconArrow";
import colors from "../__fixtures__/colors";
import iconSpec from "./__fixtures__/icon.spec";

describe("IconArrow.vue", () => {
  iconSpec(IconArrow)();

  it("has a direction", () => {
    const wrapper = mount(IconArrow, {
      provide: {
        colors
      },
      propsData: {
        direction: "down"
      }
    });
    expect(wrapper.classes()).toContain(wrapper.vm.$style.down);
  });
});
