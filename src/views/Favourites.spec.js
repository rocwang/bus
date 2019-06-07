import { shallowMount } from "@vue/test-utils";
import Favourites from "./Favourites";
import "fake-indexeddb/auto";

describe("Favourites.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Favourites);
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has the property isCollapsedInitially", () => {
    expect(wrapper.vm.isCollapsedInitially).toBe(true);
  });

  it.skip("triggers the view favourites action before route enter", () => {});
});
