import { mount } from "@vue/test-utils";
import Panel from "./Panel";

describe("Panel.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(Panel);
    expect(wrapper.element).toMatchSnapshot();
  });

  it("can be collapsed", () => {
    const wrapper = mount(Panel, {
      propsData: {
        isCollapsed: true
      }
    });
    expect(wrapper.classes()).toContain(wrapper.vm.$style.collapsed);
  });

  it("has 6 slots", () => {
    const wrapper = mount(Panel, {
      slots: {
        icon: '<p class="icon">test</p>',
        prefix: '<p class="prefix">test</p>',
        title: '<p class="title">test</p>',
        buttons: '<p class="buttons">test</p>',
        subtitle: '<p class="subtitle">test</p>',
        body: '<p class="body">test</p>'
      }
    });
    expect(wrapper.contains("p.icon")).toBe(true);
    expect(wrapper.contains("p.prefix")).toBe(true);
    expect(wrapper.contains("p.title")).toBe(true);
    expect(wrapper.contains("p.buttons")).toBe(true);
    expect(wrapper.contains("p.subtitle")).toBe(true);
    expect(wrapper.contains("p.body")).toBe(true);
  });
});
