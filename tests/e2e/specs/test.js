// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains(
      "noscript",
      "We're sorry but bus doesn't work properly without JavaScript enabled. Please enable it to continue."
    );
    cy.screenshot();
  });
});
