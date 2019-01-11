import { shallowMount } from "@vue/test-utils";
import App from "./App.vue";
import config from "./config";

describe("App.vue", () => {
  const wrapper = shallowMount(App, {
    stubs: ["router-view"]
  });

  it("renders a div as the app container", () => {
    expect(wrapper.contains("div")).toBe(true);
  });

  it('has attribute id="app"', () => {
    expect(wrapper.attributes("id")).toBe("app");
  });

  it("provides the config object", () => {
    expect(App.provide).toBeDefined();
    expect(App.provide.config).toStrictEqual(config);
  });
});
