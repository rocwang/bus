import { mount } from "@vue/test-utils";
import PanelRoute from "./PanelRoute";
import colors from "../__mocks__/colors";
import {
  actionRemoveFromFavourites$,
  actionAddToFavourites$,
} from "../store/actions";

describe("PanelRoute.vue", () => {
  let wrapper;
  let $router;
  const stopCode = "2222";
  const routeShortName = "NX2";

  beforeEach(() => {});

  it("matches the snapshot", () => {
    $router = { back: jest.fn() };
    wrapper = mount(PanelRoute, {
      provide: {
        colors,
      },
      mocks: {
        $router,
      },
      propsData: {
        stopCode,
        routeShortName,
        tripsWithVehicles: [
          {
            trip_id: "NX1",
            departure_time: "17:45:00",
            trip_headsign: "NX1",
          },
          {
            trip_id: "NX2",
            departure_time: "17:05:00",
            trip_headsign: "NX2",
          },
        ],
        favourites: [
          { name: "test1", stopCode: "1111", routeShortName: "NX1" },
          { name: "test2", stopCode: "2222", routeShortName: "NX2" },
        ],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders the stop code", () => {
    expect(wrapper.text()).toMatch(`Stop Code: ${stopCode}`);
  });

  it("renders the route short name", () => {
    expect(wrapper.text()).toMatch(routeShortName);
  });

  it("renders the trips with vehicles", () => {
    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("knows if it is favoured", () => {
    expect(wrapper.vm.isFavoured).toBe(true);
  });

  it("can be added to favourites", () => {
    const expectedPayload = {
      stopCode: "2222",
      routeShortName: "NX2",
    };
    const wrapper = mount(PanelRoute, {
      provide: {
        colors,
      },
      propsData: {
        ...expectedPayload,
      },
    });

    let nextPayload = undefined;
    actionAddToFavourites$.subscribe((payload) => (nextPayload = payload));
    wrapper.find('button[aria-label="Add to Favourites"]').trigger("click");

    expect(nextPayload).toEqual({ stopCode, routeShortName });
  });

  it("can be removed from favourites", () => {
    let nextPayload = undefined;
    actionRemoveFromFavourites$.subscribe((payload) => (nextPayload = payload));
    wrapper
      .find('button[aria-label="Delete from Favourites"]')
      .trigger("click");

    expect(nextPayload).toEqual({ stopCode, routeShortName });
  });

  it("can go back to the last view", () => {
    wrapper.find('button[aria-label="back"]').trigger("click");
    expect($router.back).toBeCalled();
  });
});
