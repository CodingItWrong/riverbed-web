import Factory from '../support/Factory';

describe('edit boards', () => {
  it('allows editing boards', () => {
    const newBoard = Factory.board({});

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
      cy.get('[aria-label="Loading"] > div').should('be.visible');
      cy.get('[aria-label="Loading"] > div').should('not.be.visible');
      cy.get('[data-testid=navigation-bar-title]').eq(1).click({force: true});

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
      cy.contains('Add Card').should('exist');

      cy.get('[aria-label="Go back"]').click();
      cy.contains('Add Card').should('not.exist');
    });

    cy.step('DELETE BOARD', () => {
      cy.contains(boardName).click();

      cy.get('[aria-label="Loading"] > div').should('be.visible');
      cy.get('[aria-label="Loading"] > div').should('not.be.visible');
      cy.get('[data-testid=navigation-bar-title]').eq(1).click({force: true});

      cy.contains('Delete Board').click();

      cy.intercept('DELETE', `http://cypressapi/boards/${updatedBoard.id}`, {
        success: true,
      }).as('deleteBoard');
      cy.contains('Confirm Delete Board').click();
      cy.wait('@deleteBoard');

      cy.contains('Add Board');
    });
  });
});
