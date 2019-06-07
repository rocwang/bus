import { mount } from "@vue/test-utils";
import PanelStop from "./PanelStop";
import colors from "./__fixtures__/colors";

describe("PanelStop.vue", () => {
  let wrapper;
  const stopCode = "SC1234";
  const stopName = "SNXXXX";

  beforeEach(() => {
    wrapper = mount(PanelStop, {
      provide: {
        colors
      },
      propsData: {
        stopCode,
        stopName,
        routeShortNames: ["NX1", "NX2"]
      },
      stubs: ["router-link"]
    });
  });

  it("matches the snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders the stop code", () => {
    expect(wrapper.text()).toMatch(stopCode);
  });

  it("renders the stop name", () => {
    expect(wrapper.text()).toMatch(stopName);
  });

  it("renders the route short names ", () => {
    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("has the border left color set for each route", () => {
    wrapper
      .findAll("li")
      .wrappers.forEach(li =>
        expect(li.attributes("style")).toMatch("border-left-color")
      );
  });
});
