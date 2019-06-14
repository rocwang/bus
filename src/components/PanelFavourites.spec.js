import { mount } from "@vue/test-utils";
import PanelFavourites from "./PanelFavourites";
import colors from "../__mocks__/colors";

describe("PanelFavourites.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PanelFavourites, {
      stubs: ["router-link"],
      provide: {
        colors
      },
      propsData: {
        isCollapsedInitially: false,
        favouritesWithTrips: [
          { name: "test1", stopCode: "stopCode1", routeShortName: "NX1" },
          { name: "test2", stopCode: "stopCode2", routeShortName: "NX2" }
        ]
      }
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("can be expanded initially", () => {
    expect(wrapper.vm.isCollapsed).toBe(false);
  });

  it("renders favourites", () => {
    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("can be toggled", () => {
    const toggleButton = wrapper.find('button[aria-label="toggle the panel"]');

    expect(wrapper.vm.isCollapsed).toBe(false);
    toggleButton.trigger("click");
    expect(wrapper.vm.isCollapsed).toBe(true);
    toggleButton.trigger("click");
    expect(wrapper.vm.isCollapsed).toBe(false);
  });
});
