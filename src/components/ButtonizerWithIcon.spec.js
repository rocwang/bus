import "fake-indexeddb/auto";
import { mount } from "@vue/test-utils";
import ButtonWithIcon from "./ButtonWithIcon";

describe("ButtonWithIcon.vue", () => {
  it("renders 2 buttons", () => {
    const wrapper = mount(ButtonWithIcon);
    expect(wrapper.element).toMatchSnapshot();
  });
});
