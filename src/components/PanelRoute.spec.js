import { mount } from "@vue/test-utils";
import PanelRoute from "./PanelRoute";
import colors from "./__fixtures__/colors";

describe("PanelRoute.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(PanelRoute, {
      provide: {
        colors
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders the stop code", () => {
    const stopCode = "1234";
    const wrapper = mount(PanelRoute, {
      provide: {
        colors
      },
      propsData: {
        stopCode
      }
    });

    expect(wrapper.text()).toMatch(`Stop Code: ${stopCode}`);
  });

  it("renders the route short name", () => {
    const routeShortName = "XXX";
    const wrapper = mount(PanelRoute, {
      provide: {
        colors
      },
      propsData: {
        routeShortName
      }
    });

    expect(wrapper.text()).toMatch(routeShortName);
  });

  // todo: finish the test
});
