import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "./App.vue";
import config from "./config";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("App.vue", () => {
  const store = {
    state: {
      route: []
    },
    getters: {
      routeGroups: jest.fn()
    },
    actions: {
      getRoutesByStop: jest.fn()
    }
  };
  const wrapper = shallowMount(App, {
    stubs: ["router-view"],
    store,
    localVue
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
