import { shallowMount } from "@vue/test-utils";
import Intro from "./Intro";
import colors from "../__mocks__/colors";

describe("Intro.vue", () => {
  let $router;
  let wrapper;

  beforeEach(() => {
    $router = {
      push: jest.fn()
    };
    wrapper = shallowMount(Intro, {
      mocks: { $router },
      provide: {
        colors
      }
    });
  });

  it("renders 2 buttons", () => {
    expect(wrapper.findAll("buttonwithicon-stub ").length).toBe(2);
  });

  it("pushes the Favourites route with query 'isCollapsed=yes' when clicking 'Find stops on map'", () => {
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
    wrapper
      .findAll("buttonwithicon-stub")
      .at(1)
      .vm.$emit("click");

    expect($router.push).toBeCalledWith({
      name: "Favourites"
    });
  });
});
