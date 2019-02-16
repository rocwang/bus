describe("Intro", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders to buttons: 'Find stops on map' & 'Show nearby stops'", () => {
    cy.get("button")
      .contains("Find stops on map")
      .should("exist");
    cy.get("button")
      .contains("Show nearby stops")
      .should("exist");
  });

  it("navigates to Favourites when click 'Find stops on map'", () => {
    cy.get("button")
      .contains("Find stops on map")
      .click();
    cy.url().should("include", "/favourites");
  });

  it("navigates to Favourites when click 'Show nearby stops'", () => {
    cy.get("button")
      .contains("Find stops on map")
      .click();
    cy.url().should("include", "/favourites");
  });
});
