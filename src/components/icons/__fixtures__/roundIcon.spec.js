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
        color: colors.red,
        bg: colors.blue
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has a color", () => {
    expect(
      wrapper
        .findAll("path")
        .at(1)
        .attributes("fill")
    ).toBe(colors.red);
  });

  it("has a background", () => {
    expect(
      wrapper
        .findAll("path")
        .at(0)
        .attributes("fill")
    ).toBe(colors.blue);
  });
};
