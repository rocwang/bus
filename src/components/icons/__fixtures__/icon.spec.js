import { mount } from "@vue/test-utils";
import colors from "../../__fixtures__/colors";

export default component => () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(component, {
      provide: {
        colors
      },
      propsData: {
        color: colors.red
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a color", () => {
    expect(wrapper.find("path").attributes("fill")).toBe(colors.red);
  });
};
