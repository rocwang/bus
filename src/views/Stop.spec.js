import { shallowMount } from "@vue/test-utils";
import Stop from "./Stop";
import "fake-indexeddb/auto";

describe("Stop.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Stop);
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it.skip("triggers the view stop action before route enter", () => {});
  it.skip("triggers the view stop action before route update", () => {});
  it.skip("triggers the view stop action before route leave", () => {});
});
