import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';

  it('allows clicking buttons to perform actions', () => {
    const board = Factory.board({
      name: 'Video Games',
    });

    const titleField = Factory.field({
      name: 'Title',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });
    const releasedAtField = Factory.field({
      name: 'Released At',
      'data-type': FIELD_DATA_TYPES.DATE.key,
      'show-in-summary': true,
    });
    const releaseButton = Factory.button({
      name: 'Release',
      'show-in-summary': false,
      action: {
        command: 'SET_VALUE',
        field: releasedAtField.id,
        value: 'NOW',
      },
      'show-condition': {
        field: releasedAtField.id,
        query: QUERIES.IS_EMPTY.key,
      },
    });
    const unreleaseButton = Factory.button({
      name: 'Unrelease',
      'show-in-summary': false,
      action: {
        command: 'SET_VALUE',
        field: releasedAtField.id,
        value: 'NOW',
      },
      'show-condition': {
        field: releasedAtField.id,
        query: QUERIES.IS_NOT_EMPTY.key,
      },
    });

    const releasedColumn = Factory.column({
      name: 'Released',
      'card-inclusion-conditions': [
        {
          field: releasedAtField.id,
          query: QUERIES.IS_NOT_EMPTY.key,
        },
      ],
    });
    const unreleasedColumn = Factory.column({
      name: 'Unreleased',
      'card-inclusion-conditions': [
        {
          field: releasedAtField.id,
          query: QUERIES.IS_EMPTY.key,
        },
      ],
    });

    const elements = [
      titleField,
      releasedAtField,
      releaseButton,
      unreleaseButton,
    ];
    const card = Factory.card({
      [titleField.id]: title,
    });

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: elements,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [releasedColumn, unreleasedColumn],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.log('SET VALUE TO NOW');

    cy.get(`[data-testid="column-${unreleasedColumn.id}"]`)
      .contains(title)
      .click();
    cy.get(`[data-testid=button-${unreleaseButton.id}]`).should('not.exist');

    const updatedCard = Factory.card(
      {[releasedAtField.id]: '2023-01-01'},
      card,
    );
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [updatedCard],
    });

    cy.get(`[data-testid=button-${releaseButton.id}]`).click();

    cy.get(`[data-testid="column-${releasedColumn.id}"]`).contains(title);
  });
});
