import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "./App";
import config from "./config";
import VueRouter from "vue-router";
import VueRx from "vue-rx";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueRx);

describe("App.vue", () => {
  const wrapper = shallowMount(App, {
    stubs: ["Mapbox"],
    localVue,
    router: new VueRouter({
      routes: [
        {
          path: "/stop/:stopCode",
          name: "Stop"
        }
      ]
    })
  });

  it("renders a div as the app container", () => {
    expect(wrapper.is("div")).toBe(true);
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

  it("can handle stop click", () => {
    wrapper.find("mapbox-stub").vm.$emit("stopClick", "1234");
    expect(wrapper.vm.$router.currentRoute.name).toBe("Stop");
    expect(wrapper.vm.$router.currentRoute.params.stopCode).toBe("1234");
  });

  it("subscribes to stopCode$ and vehicles$", () => {
    expect(wrapper.vm.stopCode).toBe("");
    expect(wrapper.vm.vehicles).toEqual([]);
  });
});
