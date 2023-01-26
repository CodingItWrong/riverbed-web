// choose an option from a RN Paper select component
// usage: cy.get(paperSelectSelector).paperSelect(optionLabel)
Cypress.Commands.add(
  'paperSelect',
  {prevSubject: true},
  (subject, optionLabel) => {
    subject.click();
    cy.get('[data-testid=paper-dropdown-option]')
      .contains(optionLabel)
      .click({force: true});
  },
);
