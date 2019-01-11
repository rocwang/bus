describe("Page not found", () => {
  it("redirects back to homepage", () => {
    cy.visit("/no-such-page");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
