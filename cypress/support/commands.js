// choose an option from a RN Paper select component
// usage: cy.get(paperSelectSelector).paperSelect(optionLabel)
Cypress.Commands.add(
  'paperSelect',
  {prevSubject: true},
  (subject, optionLabel) => {
    subject.click();

    // cy.get('[data-testid=paper-dropdown-option]')
    cy.get('[role=menuitem]')
      .contains(optionLabel)
      .should('be.visible') // wait until it's visible before clicking
      .click({force: true}); // still click with force: true because of a parent pointer-events: none
  },
);
