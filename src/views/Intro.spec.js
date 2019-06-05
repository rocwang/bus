import { shallowMount } from "@vue/test-utils";
import Intro from "./Intro";

describe("Intro.vue", () => {
  let $router;

  beforeEach(() => {
    $router = {
      push: jest.fn()
    };
  });

  it("renders 2 buttons", () => {
    const wrapper = shallowMount(Intro, { mocks: { $router } });

    expect(wrapper.findAll("buttonwithicon-stub ").length).toBe(2);
  });

  it("pushes the Favourites route with query 'isCollapsed=yes' when clicking 'Find stops on map'", () => {
    const wrapper = shallowMount(Intro, {
      mocks: {
        $router
      }
    });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(0)
      .vm.$emit("click");

    expect($router.push).toBeCalledWith({
      name: "Favourites",
      query: { isCollapsed: "yes" }
    });
  });

  it("pushes the Favourites route when clicking 'Show nearby stops'", () => {
    const wrapper = shallowMount(Intro, { mocks: { $router } });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(1)
      .vm.$emit("click");

    expect($router.push).toBeCalledWith({
      name: "Favourites"
    });
  });
});
