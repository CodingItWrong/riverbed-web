describe('login', () => {
  const apiUrl = 'http://cypressapi';

  it('allows logging in with an email and password', () => {
    cy.visit('/');

    const email = 'example@example.com';
    const password = 'password1';
    const accessToken = 'fake_access_token';

    cy.get('[data-testid="text-input-email"]').type(email);
    cy.get('[data-testid="text-input-password"]').type(password);

    cy.intercept('POST', `${apiUrl}/oauth/token`, {
      access_token: accessToken,
    }).as('logIn');
    cy.intercept('GET', `${apiUrl}/boards?`, {data: []}).as('getBoards');
    cy.contains('Sign in').click();
    cy.wait('@logIn').its('request.body').should('deep.equal', {
      grant_type: 'password',
      username: email,
      password,
    });
    cy.contains('My Boards');
    cy.wait('@getBoards')
      .its('request.headers.authorization')
      .should('equal', `Bearer ${accessToken}`);
  });

  it('allows logging out', () => {
    cy.intercept('GET', 'http://cypressapi/boards?', {data: []});

    cy.signIn();

    cy.contains('My Boards');

    cy.get('[aria-label="App Menu"]').click();
    cy.get('[aria-label="Sign Out"]').click();

    cy.contains('My Boards').should('not.exist');
    cy.contains('Sign in').should('exist');
  });
});
