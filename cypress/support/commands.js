// choose an option from a RN Paper select component
// usage: cy.get(paperSelectSelector).paperSelect(optionLabel)
Cypress.Commands.add(
  'paperSelect',
  {prevSubject: true},
  (subject, optionLabel) => {
    subject.click();

    cy.get('[role=menuitem]')
      .contains(optionLabel)
      // .should('be.visible') // may help timing, but also requires you to scroll down to it
      .click({force: true}); // needed whether or not visible because of a parent pointer-events: none
    cy.get('[role=menuitem]').should('not.exist');
  },
);

Cypress.Commands.add('assertOrder', (selector, assertions) => {
  assertions.forEach((assertion, i) => {
    assertion(cy.get(selector).eq(i));
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
