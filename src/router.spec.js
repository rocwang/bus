import router from "./router";

it("has the mode set to 'history", () => {
  expect(router.mode).toBe("history");
});

it("has the Intro route", () => {
  const { route } = router.resolve({ name: "Intro" });
  expect(route.name).toBe("Intro");
});

it("has the Favourites route", () => {
  const { route } = router.resolve({
    name: "Favourites",
    query: { isCollapsed: "yes" },
  });
  expect(route.name).toBe("Favourites");
  expect(route.matched[0].props.default(route)).toMatchObject({
    isCollapsedInitially: true,
  });
});

it("has the Stop route", () => {
  const expected = {
    name: "Stop",
    params: { stopCode: "1234" },
  };
  const { route } = router.resolve(expected);
  expect(route.name).toBe(expected.name);
  expect(route.params).toEqual(expected.params);
});

it("has the Route route", () => {
  const expected = {
    name: "Route",
    params: { stopCode: "1234", shortName: "NX1" },
  };
  const { route } = router.resolve(expected);
  expect(route.name).toBe(expected.name);
  expect(route.params).toEqual(expected.params);
});
