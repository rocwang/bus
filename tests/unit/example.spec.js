import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  it("renders a div as the app container", () => {
    const wrapper = shallowMount(App, {
      stubs: ["router-link", "router-view"]
    });
    expect(wrapper.contains("div")).toBe(true);
  });
});
