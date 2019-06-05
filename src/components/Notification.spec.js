import { mount } from "@vue/test-utils";
import Notification from "./Notification";

describe("Notification.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(Notification);
    expect(wrapper.element).toMatchSnapshot();
  });

  it("emits a 'close' event when press ESC", () => {
    const wrapper = mount(Notification);
    wrapper.trigger("keyup.esc");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("has a default slot", () => {
    const wrapper = mount(Notification, {
      slots: {
        default: "<button/>"
      }
    });
    expect(wrapper.contains("button")).toBe(true);
  });
});
