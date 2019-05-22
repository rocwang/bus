import "fake-indexeddb/auto";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "./App";
import config from "./config";
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);

describe("App.vue", () => {
  const wrapper = shallowMount(App, {
    stubs: ["Mapbox"],
    localVue,
    router: new VueRouter()
  });

  it("renders a div as the app container", () => {
    expect(wrapper.contains("div")).toBe(true);
  });

  it('has attribute id="app"', () => {
    expect(wrapper.attributes("id")).toBe("app");
  });

  it("provides the config object", () => {
    expect(App.provide).toBeDefined();
    expect(App.provide.call({ $style: {} }).config).toStrictEqual(config);
  });

  it("provides colors", () => {
    expect(App.provide).toBeDefined();
    expect(
      App.provide.call({
        $style: {
          notAColor: "foo",
          colorRed: "red"
        }
      }).colors
    ).toStrictEqual({ red: "red" });
  });
});
