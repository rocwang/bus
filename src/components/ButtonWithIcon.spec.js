import { mount } from "@vue/test-utils";
import ButtonWithIcon from "./ButtonWithIcon";

describe("ButtonWithIcon.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(ButtonWithIcon);
    expect(wrapper.element).toMatchSnapshot();
  });
});
