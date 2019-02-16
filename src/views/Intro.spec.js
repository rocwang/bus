import { shallowMount, createLocalVue } from "@vue/test-utils";
import Intro from "./Intro";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Intro.vue", () => {
  let store;
  let $router;

  beforeEach(() => {
    store = {
      state: {
        triggerGeolocate: false
      },
      mutations: {
        setTriggerGeolocate: jest.fn()
      }
    };

    $router = {
      push: jest.fn()
    };
  });

  it("renders 2 buttons", () => {
    const wrapper = shallowMount(Intro, {
      mocks: {
        $router
      },
      store: new Vuex.Store(store),
      localVue
    });

    expect(wrapper.findAll("buttonwithicon-stub ").length).toBe(2);
  });

  it("push the Favourites route when clicking 'Find stops on map', but does not commit the 'setTriggerGeolocate' mutation", () => {
    const wrapper = shallowMount(Intro, {
      mocks: {
        $router
      },
      store: new Vuex.Store(store),
      localVue
    });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(0)
      .vm.$emit("click");

    expect(store.mutations.setTriggerGeolocate).not.toBeCalled();
    expect($router.push).toBeCalledWith({ name: "Favourites" });
  });

  it("commit the 'setTriggerGeolocate' mutation and push the Favourites route when clicking 'Show nearby stops'", () => {
    const wrapper = shallowMount(Intro, {
      mocks: {
        $router
      },
      store: new Vuex.Store(store),
      localVue
    });

    wrapper
      .findAll("buttonwithicon-stub")
      .at(1)
      .vm.$emit("click");

    expect(store.mutations.setTriggerGeolocate).toBeCalled();
    expect($router.push).toBeCalledWith({ name: "Favourites" });
  });
});
