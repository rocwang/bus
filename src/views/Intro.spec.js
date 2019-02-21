import { shallowMount, createLocalVue } from "@vue/test-utils";
import Intro from "./Intro";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Intro.vue", () => {
  let $router;

  beforeEach(() => {
    $router = {
      push: jest.fn()
    };
  });

  it("renders 2 buttons", () => {
    const wrapper = shallowMount(Intro, { mocks: { $router }, localVue });

    expect(wrapper.findAll("buttonwithicon-stub ").length).toBe(2);
  });

  it("pushes the Favourites route when clicking 'Find stops on map'", () => {
    const wrapper = shallowMount(Intro, {
      mocks: {
        $router
      },
      localVue
    });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(0)
      .vm.$emit("click");

    expect($router.push).toBeCalledWith({ name: "Favourites" });
  });

  it("pushes the Favourites route with query 'locate=yes' when clicking 'Show nearby stops'", () => {
    const wrapper = shallowMount(Intro, { mocks: { $router }, localVue });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(1)
      .vm.$emit("click");

    expect($router.push).toBeCalledWith({
      name: "Favourites",
      query: { locate: "yes" }
    });
  });
});
