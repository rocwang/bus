import { mount } from "@vue/test-utils";
import PanelFavourites from "./PanelFavourites";
import colors from "./__fixtures__/colors";

describe("PanelFavourites.vue", () => {
  it("matches the snapshot", () => {
    const wrapper = mount(PanelFavourites, {
      stubs: ["router-link"],
      provide: {
        colors
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("can be expanded initially", () => {
    const wrapper = mount(PanelFavourites, {
      stubs: ["router-link"],
      provide: {
        colors
      },
      propsData: {
        isCollapsedInitially: false
      }
    });
    expect(wrapper.vm.isCollapsed).toBe(false);
  });

  it("renders favourites", () => {
    const wrapper = mount(PanelFavourites, {
      stubs: ["router-link"],
      provide: {
        colors
      },
      propsData: {
        favouritesWithTrips: [
          { name: "test1", stopCode: "stopCode1", routeShortName: "NX1" },
          { name: "test2", stopCode: "stopCode2", routeShortName: "NX2" }
        ]
      }
    });

    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("can be toggled", () => {
    const wrapper = mount(PanelFavourites, {
      stubs: ["router-link"],
      provide: {
        colors
      }
    });
    const toggleButon = wrapper.find('button[aria-label="toggle the panel"]');

    toggleButon.trigger("click");
    expect(wrapper.vm.isCollapsed).toBe(false);
    toggleButon.trigger("click");
    expect(wrapper.vm.isCollapsed).toBe(true);
  });
});
