import Factory from '../support/Factory';

describe('edit boards', () => {
  it('allows editing boards', () => {
    const newBoard = Factory.board({options: {}});

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [],
    });
    cy.intercept('GET', 'http://cypressapi/boards/1/cards?', {data: []});
    cy.intercept('GET', 'http://cypressapi/boards/1/columns?', {data: []});
    cy.intercept('GET', 'http://cypressapi/boards/1/elements?', {data: []});

    cy.signIn();

    cy.step('ADD BOARD', () => {
      cy.intercept('POST', 'http://cypressapi/boards?', {data: newBoard}).as(
        'addBoard',
      );
      cy.intercept('GET', 'http://cypressapi/boards?', {
        data: [newBoard],
      });
      cy.intercept('GET', `http://cypressapi/boards/${newBoard.id}?`, {
        data: newBoard,
      });
      cy.contains('Add Board').click();
      cy.wait('@addBoard')
        .its('request.body')
        .should('deep.equal', {data: {type: 'boards', attributes: {}}});
    });

    const boardName = 'Video Games';
    const updatedBoard = Factory.board({name: boardName}, newBoard);
    cy.step('EDIT BOARD', () => {
      // may need to wait for the board to load
      // loading indicators are hard in MUI; consider checking for nav bar title text instead
      cy.get('[data-testid=navigation-bar-title]').click({force: true});

      cy.get('[data-testid="text-input-board-name"]').type(boardName);

      cy.intercept('PATCH', `http://cypressapi/boards/${newBoard.id}?`, {
        success: true,
      }).as('updateBoard');
      cy.intercept('GET', 'http://cypressapi/boards?', {
        data: [updatedBoard],
      });
      cy.intercept('GET', `http://cypressapi/boards/${newBoard.id}?`, {
        data: updatedBoard,
      });
      cy.contains('Save Board').click();
      cy.wait('@updateBoard')
        .its('request.body')
        .should('deep.equal', {data: updatedBoard});

      cy.get('[data-testid="text-input-board-name"]').should('not.exist');
      cy.contains(boardName).should('exist');
      cy.get('[aria-label="Add Card"]').should('exist');

      cy.get('[aria-label="Go back"]').click();
      cy.get('[aria-label="Add Card"]').should('not.exist');
    });

    cy.step('DELETE BOARD', () => {
      cy.contains(boardName).click();

      // may need to wait for the board to load
      // loading indicators are hard in MUI; consider checking for nav bar title text instead
      cy.get('[data-testid=navigation-bar-title]').click({force: true});

      cy.contains('Delete Board').click();

      cy.intercept('DELETE', `http://cypressapi/boards/${updatedBoard.id}`, {
        success: true,
      }).as('deleteBoard');
      cy.contains('Yes, Delete Board').click();
      cy.wait('@deleteBoard');

      cy.contains('Add Board');
    });
  });

  it('allows favoriting boards', () => {
    const gamesBoard = Factory.board({name: 'Games'});
    const vegetablesBoard = Factory.board({name: 'Vegetables'});

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [vegetablesBoard, gamesBoard],
    });

    cy.signIn();

    cy.step('CHECK WHAT IS SHOWN WHEN NO BOARDS ARE FAVORITES', () => {
      // unfavorite boards are sorted alphabetically
      cy.assertOrder('[aria-label*="a favorite board"]', [
        e =>
          e
            .invoke('attr', 'aria-label')
            .should('eq', 'Games is not a favorite board. Tap to favorite'),
        e =>
          e
            .invoke('attr', 'aria-label')
            .should(
              'eq',
              'Vegetables is not a favorite board. Tap to favorite',
            ),
      ]);

      cy.contains('Favorites').should('not.exist');
      cy.contains('Other Boards').should('not.exist');
    });

    const favoriteVegetablesBoard = Factory.board(
      {
        'favorited-at': new Date(2023, 1, 1, 0, 0, 0).toISOString(),
      },
      vegetablesBoard,
    );
    cy.step('FAVORITE A BOARD', () => {
      cy.intercept('PATCH', `http://cypressapi/boards/${vegetablesBoard.id}?`, {
        success: true,
      }).as('updateVegetables');
      cy.intercept('GET', 'http://cypressapi/boards?', {
        data: [gamesBoard, favoriteVegetablesBoard],
      });
      cy.get(
        '[aria-label="Vegetables is not a favorite board. Tap to favorite"]',
      ).click();
      cy.wait('@updateVegetables')
        .its('request.body.data.attributes["favorited-at"]')
        .should('be.a', 'string');
      cy.get(
        '[aria-label="Vegetables is a favorite board. Tap to unfavorite"]',
      );

      cy.contains('Favorites').should('exist');
      cy.contains('Other Boards').should('exist');
    });

    const favoriteGamesBoard = Factory.board(
      {
        'favorited-at': new Date(2023, 1, 2, 0, 0, 0).toISOString(),
      },
      gamesBoard,
    );
    cy.step('FAVORITE THE OTHER BOARD', () => {
      cy.intercept('PATCH', `http://cypressapi/boards/${gamesBoard.id}?`, {
        success: true,
      }).as('updateGames');
      cy.intercept('GET', 'http://cypressapi/boards?', {
        data: [favoriteGamesBoard, favoriteVegetablesBoard],
      });
      cy.get(
        '[aria-label="Games is not a favorite board. Tap to favorite"]',
      ).click();
      cy.wait('@updateGames')
        .its('request.body.data.attributes["favorited-at"]')
        .should('be.a', 'string');

      // favorite boards are sorted by time added
      cy.assertOrder('[aria-label*="a favorite board"]', [
        e =>
          e
            .invoke('attr', 'aria-label')
            .should('eq', 'Vegetables is a favorite board. Tap to unfavorite'),
        e =>
          e
            .invoke('attr', 'aria-label')
            .should('eq', 'Games is a favorite board. Tap to unfavorite'),
      ]);

      cy.contains('Favorites').should('exist');
      cy.contains('Other Boards').should('not.exist');
    });

    cy.step('UNFAVORITE A BOARD', () => {
      cy.intercept('PATCH', `http://cypressapi/boards/${vegetablesBoard.id}?`, {
        success: true,
      }).as('updateVegetables');
      cy.intercept('GET', 'http://cypressapi/boards?', {
        data: [favoriteGamesBoard, vegetablesBoard],
      });
      cy.get(
        '[aria-label="Vegetables is a favorite board. Tap to unfavorite"]',
      ).click();
      cy.wait('@updateVegetables')
        .its('request.body.data.attributes["favorited-at"]')
        .should('be.null');
      cy.get(
        '[aria-label="Vegetables is not a favorite board. Tap to favorite"]',
      );
    });
  });
});
