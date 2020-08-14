import { first } from "rxjs/operators";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRx from "vue-rx";

jest.mock("../api/gtfs");
jest.mock("../api/gtfsRealtime");

describe("Stop.vue", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetModules();

    const localVue = createLocalVue();
    localVue.use(VueRx);

    const Stop = require("./Stop").default;

    wrapper = shallowMount(Stop, {
      localVue,
      mocks: {
        $route: {
          params: {
            stopCode: "1234",
          },
        },
      },
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("triggers the view stop action when created", async () => {
    expect(wrapper.vm.stopName).toBe("ABCD");
    expect(wrapper.vm.routeShortNames).toEqual(["NX1"]);
    expect(wrapper.vm.stopCode).toEqual("1234");
  });

  it("triggers the view stop action before route update", async () => {
    const { actionViewStop$ } = require("../store/actions");
    const result = actionViewStop$.pipe(first()).toPromise();
    const next = jest.fn();
    wrapper.vm.$options.beforeRouteUpdate(
      {
        params: { stopCode: "1234" },
      },
      undefined,
      next
    );
    expect(next).toBeCalled();
    expect(await result).toEqual("1234");
  });

  it("triggers the view stop action before route leave", async () => {
    const { actionViewStop$ } = require("../store/actions");
    const result = actionViewStop$.pipe(first()).toPromise();
    const next = jest.fn();
    wrapper.vm.$options.beforeRouteLeave(undefined, undefined, next);
    expect(next).toBeCalled();
    expect(await result).toEqual("");
  });
});
