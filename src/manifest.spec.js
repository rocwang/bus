import manifest from "./manifest";

it("has the necessary properties", () => {
  expect(manifest).toMatchObject({
    name: expect.any(String),
    short_name: expect.any(String),
    description: expect.any(String),
    lang: expect.any(String),
    orientation: expect.any(String),
    scope: expect.any(String),
    start_url: expect.any(String),
    display: expect.any(String),
    dir: expect.any(String),
    background_color: expect.any(String),
    theme_color: expect.any(String),
  });
});
