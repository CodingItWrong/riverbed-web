// choose an option from a RN Paper select component
// usage: cy.get(paperSelectSelector).paperSelect(optionLabel)
Cypress.Commands.add(
  'paperSelect',
  {prevSubject: true},
  (subject, optionLabel) => {
    subject.click();

    cy.get('[role=menuitem]')
      .contains(optionLabel)
      .should('be.visible') // wait until it's visible before clicking
      .click({force: true}); // still click with force: true because of a parent pointer-events: none
    cy.get('[role=menuitem]').should('not.exist');
  },
);

Cypress.Commands.add('assertContentsOrder', (selector, values) => {
  values.forEach((value, i) => {
    cy.get(selector).eq(i).contains(value);
  });
});

Cypress.Commands.add('assertTestIdOrder', (selector, values) => {
  values.forEach((childSelector, i) => {
    cy.get(selector)
      .eq(i)
      .invoke('attr', 'data-testid')
      .should('eq', childSelector);
  });
});

Cypress.Commands.add('step', (name, callback) => {
  cy.log(name);
  callback();
});

Cypress.Commands.add('signIn', () => {
  window.localStorage.setItem('LIST_APP_ACCESS_TOKEN', 'FAKE_ACCESS_TOKEN');
  cy.visit('/');
});
