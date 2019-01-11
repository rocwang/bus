describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("has required tags in the head element", () => {
    cy.title().should("eq", "Bus");
    cy.get("div#app").should("exist");
    cy.get('head meta[charset="utf-8"]').should("exist");
    cy.get('head meta[name="viewport"]').should(
      "have.attr",
      "content",
      "width=device-width,initial-scale=1"
    );
    cy.get('head link[rel="manifest"]').should(
      "have.attr",
      "href",
      "/manifest.webmanifest"
    );
    cy.get('head link[rel="icon"]').should(
      "have.attr",
      "href",
      "/icons/icon-192.png"
    );
  });

  it("has the noscript tag saying requiring Javascript", () => {
    cy.get("noscript").should(
      "have.text",
      "<strong>We're sorry but bus doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>"
    );
  });
});
