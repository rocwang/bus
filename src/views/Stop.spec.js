import { createLocalVue, shallowMount } from "@vue/test-utils";
import Stop from "./Stop";
import VueRx from "vue-rx";
import { stopRouteTrip$ } from "../observables";

jest.mock("../observables");

const localVue = createLocalVue();
localVue.use(VueRx);

describe("Stop.vue", () => {
  let $router;

  beforeEach(() => {
    $router = {
      push: jest.fn()
    };
  });

  it("sets stopCode properly upon created and destroyed", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $router
      },
      propsData: {
        stopCode: "5678"
      },
      localVue
    });

    expect(wrapper.vm.stopCode).toBe("5678");
    expect(wrapper.vm.routeShortNames).toEqual([]);
    expect(wrapper.vm.stopName).toBe("stop name");

    wrapper.destroy();

    expect(stopRouteTrip$.value).toEqual({ stopCode: "" });
  });
});
