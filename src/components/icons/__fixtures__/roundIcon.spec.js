import { mount } from "@vue/test-utils";
import colors from "../../__fixtures__/colors";

export default component => () => {
  it("matches the snapshot", () => {
    const wrapper = mount(component, {
      provide: {
        colors
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a color", () => {
    const wrapper = mount(component, {
      provide: {
        colors
      },
      propsData: {
        color: colors.red
      }
    });
    expect(
      wrapper
        .findAll("path")
        .at(1)
        .attributes("fill")
    ).toBe(colors.red);
  });

  it("has a background", () => {
    const wrapper = mount(component, {
      provide: {
        colors
      },
      propsData: {
        bg: colors.blue
      }
    });
    expect(
      wrapper
        .findAll("path")
        .at(0)
        .attributes("fill")
    ).toBe(colors.blue);
  });
};
