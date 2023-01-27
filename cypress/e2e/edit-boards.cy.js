import Factory from '../support/Factory';

describe('edit boards', () => {
  it('allows editing boards', () => {
    const newBoard = Factory.board({});

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [],
    });

    cy.visit('/');

    cy.log('ADD BOARD');

    cy.intercept('POST', 'http://cypressapi/boards?', {data: newBoard}).as(
      'addBoard',
    );
    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [newBoard],
    });
    cy.contains('Add Board').click();
    cy.wait('@addBoard')
      .its('request.body')
      .should('deep.equal', {data: {type: 'boards', attributes: {}}});

    cy.log('EDIT BOARD');

    cy.contains('Edit Board').click();
    const boardName = 'Video Games';
    cy.get('[data-testid="text-input-board-name"]').type(boardName);

    const updatedBoard = Factory.board({name: boardName}, newBoard);
    cy.intercept('PATCH', `http://cypressapi/boards/${newBoard.id}?`, {
      success: true,
    }).as('updateBoard');
    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [updatedBoard],
    });
    cy.contains('Save Board').click();
    cy.wait('@updateBoard')
      .its('request.body')
      .should('deep.equal', {data: updatedBoard});

    cy.get('[data-testid="text-input-board-name"]').should('not.exist');
    cy.contains(boardName).click();
    cy.contains('Edit Elements');

    cy.get('[aria-label="Back to Board List"]').click();
    cy.contains('Edit Elements').should('not.exist');

    cy.log('DELETE BOARD');

    cy.contains(boardName).click();
    cy.contains('Edit Board').click();
    cy.contains('Delete Board').click();

    cy.intercept('DELETE', `http://cypressapi/boards/${updatedBoard.id}`, {
      success: true,
    }).as('deleteBoard');
    cy.contains('Confirm Delete Board').click();
    cy.wait('@deleteBoard');

    cy.contains('Add Board');
  });
});
