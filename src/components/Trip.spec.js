import { mount, createLocalVue } from "@vue/test-utils";
import VueRx from "vue-rx";
import Trip from "./Trip";
import colors from "../__mocks__/colors";

describe("Trip.vue", () => {
  let wrapper;
  const headSign = "Albany";

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(VueRx);
    wrapper = mount(Trip, {
      localVue,
      provide: {
        colors,
      },
      propsData: {
        headSign,
        departureTime: "11:44:00",
        occupancyStatus: 3,
        isRealTime: true,
        isDetailEnabled: true,
      },
    });
  });

  it("renders the head sign", () => {
    expect(wrapper.text()).toMatch(headSign);
  });

  it("renders the formatted departure time", () => {
    expect(wrapper.text()).toMatch(wrapper.vm.formattedDepartureTime);
  });

  it("renders the formatted occupancy status", () => {
    expect(wrapper.text()).toMatch("Occupancy: Standing room only");
  });

  it("indicated if the trip is being tracked", () => {
    expect(wrapper.text()).toMatch("(R)");
  });

  it("has toggleable details", () => {
    wrapper.trigger("click");
    const details = wrapper.find("table");
    expect(details).toBeTruthy();
    expect(details.text()).toMatch(
      "Departure 11:44:00 Occupancy Standing room" + " only"
    );
  });
});
