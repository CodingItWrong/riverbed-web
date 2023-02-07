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
  cy.visit('/');

  const email = 'example@example.com';
  const password = 'password1';
  const accessToken = 'fake_access_token';

  cy.get('[data-testid="text-input-email"]').type(email);
  cy.get('[data-testid="text-input-password"]').type(password);

  cy.intercept('POST', 'http://cypressapi/oauth/token', {
    access_token: accessToken,
  }).as('logIn');
  cy.intercept('GET', 'http://cypressapi/boards?', {data: []}).as('getBoards');
  cy.contains('Sign in').click();
  cy.wait('@logIn').its('request.body').should('deep.equal', {
    grant_type: 'password',
    username: email,
    password,
  });
});
