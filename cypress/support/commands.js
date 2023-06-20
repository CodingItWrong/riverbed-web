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
  window.localStorage.setItem(
    'RIVERBED_ACCESS_TOKEN',
    JSON.stringify({accessToken: 'FAKE_ACCESS_TOKEN', userId: 27}),
  );
  cy.visit('/');
});
