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
    expect(wrapper.find("path").attributes("fill")).toBe(colors.red);
  });
};
