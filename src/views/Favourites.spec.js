import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRx from "vue-rx";

describe("Favourites.vue", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetModules();

    const localVue = createLocalVue();
    localVue.use(VueRx);

    const Favourites = require("./Favourites").default;
    wrapper = shallowMount(Favourites, { localVue });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has the property isCollapsedInitially", () => {
    expect(wrapper.vm.isCollapsedInitially).toBe(true);
  });

  it("has favouritesWithTrips", () => {
    expect(wrapper.vm.favouritesWithTrips).toEqual([]);
  });
});
