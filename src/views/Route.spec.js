import { shallowMount } from "@vue/test-utils";
import Route from "./Route";
import "fake-indexeddb/auto";

describe("Route.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Route);
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it.skip("triggers the view route action before route enter", () => {});
  it.skip("triggers the view route action before route update", () => {});
  it.skip("triggers the view route action before route leave", () => {});
});
