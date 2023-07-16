describe('auth', () => {
  const apiUrl = 'http://cypressapi';

  it('allows signing in with an email and password', () => {
    cy.visit('/');

    const email = 'example@example.com';
    const password = 'password1';
    const accessToken = 'fake_access_token';

    cy.get('[data-testid="text-input-email"]').type(email);
    cy.get('[data-testid="text-input-password"]').type(password);

    cy.intercept('POST', `${apiUrl}/oauth/token`, {
      access_token: accessToken,
    }).as('signIn');
    cy.intercept('GET', `${apiUrl}/boards?`, {data: []}).as('getBoards');
    cy.contains('Sign in').click();
    cy.wait('@signIn').its('request.body').should('deep.equal', {
      grant_type: 'password',
      username: email,
      password,
    });
    cy.contains('My Boards');
    cy.wait('@getBoards')
      .its('request.headers.authorization')
      .should('equal', `Bearer ${accessToken}`);
  });

  it('allows signing out', () => {
    cy.intercept('GET', 'http://cypressapi/boards?', {data: []});

    cy.signIn();

    cy.contains('My Boards');

    cy.get('[aria-label="App Menu"]').click();
    cy.contains('Sign Out').click();

    cy.contains('My Boards').should('not.exist');
    cy.contains('Sign in').should('exist');
  });

  it('allows signing up', () => {
    cy.visit('/');

    const email = 'example@example.com';
    const password = 'passwrd1';

    cy.contains('Sign up').click();

    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Email is required');

    cy.get('[data-testid="text-input-new-email"]').type(
      'not-an-email@not-a-domain',
    );
    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Email does not appear to be a valid email address');

    cy.get('[data-testid="text-input-new-email"]').clear().type(email);
    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Password is required');

    cy.get('[data-testid="text-input-new-password"]').type('a');
    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Password must be at least 8 characters');

    cy.get('[data-testid="text-input-new-password"]').clear().type(password);
    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Passwords do not match');

    cy.get('[data-testid="text-input-confirm-new-password"]').type(password);
    cy.get('[data-testid=sign-up-submit-button]').click();
    cy.contains('Please choose whether or not to allow emails');

    cy.contains('(choose)').click();
    cy.contains('No').click();

    cy.intercept('POST', `${apiUrl}/users?`, {
      email,
      password,
      'allow-email': false,
    }).as('signUp');
    cy.get('[data-testid=sign-up-submit-button]').click();

    cy.contains('Account Created');
  });
});
