import { mount } from "@vue/test-utils";
import UpdateNotification from "./UpdateNotification";

describe("UpdateNotification.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(UpdateNotification);
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("can be toggled", () => {
    expect(wrapper.isEmpty()).toBe(true);

    wrapper.setData({ isVisible: true });

    expect(wrapper.isEmpty()).toBe(false);

    const dismissButton = wrapper
      .findAll("button")
      .filter(wrapper => wrapper.text() === "Dismiss");

    dismissButton.trigger("click");

    expect(wrapper.isEmpty()).toBe(true);
  });

  it('has an "update" button', () => {
    wrapper.setData({ isVisible: true });
    wrapper.setMethods({
      update: jest.fn()
    });

    const reloadButton = wrapper
      .findAll("button")
      .filter(wrapper => wrapper.text() === "Reload");
    reloadButton.trigger("click");

    expect(wrapper.vm.update).toBeCalled();
  });
});
