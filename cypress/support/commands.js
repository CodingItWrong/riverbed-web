// choose an option from a RN Paper select component
// usage: cy.get(paperSelectSelector).paperSelect(optionLabel)
Cypress.Commands.add(
  'paperSelect',
  {prevSubject: true},
  (subject, optionLabel) => {
    subject.click();

    // wait until it's visible before clicking
    cy.get('[data-testid=paper-dropdown-option]')
      .contains(optionLabel)
      .should('be.visible');

    // still click with force: true because of a parent pointer-events: none
    cy.get('[data-testid=paper-dropdown-option]')
      .contains(optionLabel)
      .click({force: true});
  },
);
