import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';
  const publisher = 'Square Enix';
  const updatedTitle = 'Chrono Trigger';
  const newTitle = 'Earthbound';

  it('allows editing cards', () => {
    const board = Factory.board({
      name: 'Video Games',
    });

    const titleField = Factory.field({
      name: 'Title',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });
    const publisherField = Factory.field({
      name: 'Publisher',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': false,
    });
    const releasedAtField = Factory.field({
      name: 'Released At',
      'data-type': FIELD_DATA_TYPES.DATE.key,
      'show-in-summary': true,
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

    const fields = [titleField, publisherField, releasedAtField];
    const card = Factory.card({
      [titleField.id]: title,
      [publisherField.id]: publisher,
    });

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: fields,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [releasedColumn, unreleasedColumn],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.step('SHOW DETAIL', () => {
      cy.get(`[data-testid="column-${unreleasedColumn.id}"]`)
        .contains(title)
        .click();
      cy.get(`[data-testid="text-input-${publisherField.id}"]`)
        .invoke('val')
        .should('eq', publisher);
    });

    cy.step('HIDE DETAIL', () => {
      cy.get('[aria-label="Close card"]').click();
      cy.contains(publisher).should('not.exist');
    });

    cy.step('EDIT CARD', () => {
      const updatedCard = Factory.card({[titleField.id]: updatedTitle}, card);
      cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
        success: true,
      }).as('updateCard1');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [updatedCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
        data: updatedCard,
      });

      cy.contains(card.attributes['field-values'][titleField.id]).click();
      cy.get(`[data-testid=text-input-${titleField.id}]`).clear();
      cy.wait('@updateCard1');

      cy.get(`[data-testid=text-input-${titleField.id}]`).type(updatedTitle);
      cy.wait('@updateCard1')
        .its('request.body')
        .should('deep.equal', {data: updatedCard});

      cy.get('[aria-label="Close card"]').click();

      cy.contains(card.attributes['field-values'][titleField.id]).should(
        'not.exist',
      );
    });

    cy.step('DELETE CARD', () => {
      cy.intercept('DELETE', `http://cypressapi/cards/${card.id}`, {
        success: true,
      }).as('deleteCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [],
      });

      cy.contains(updatedTitle).click();
      cy.get('[aria-label="Delete Card"]').click();
      cy.contains('Yes, Delete Card').click();
      cy.wait('@deleteCard');
      cy.contains(updatedTitle).should('not.exist');
    });

    cy.step('CREATE CARD', () => {
      const newCard = Factory.card();
      cy.intercept('POST', 'http://cypressapi/cards?', {data: newCard}).as(
        'createCard',
      );
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [newCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${newCard.id}?`, {
        data: newCard,
      });
      cy.get('[aria-label="Add Card"]').click();
      cy.wait('@createCard')
        .its('request.body')
        .should('deep.equal', {
          data: {
            type: 'cards',
            relationships: {
              board: {data: {type: 'boards', id: String(board.id)}},
            },
            attributes: {
              'field-values': {},
            },
          },
        });
      const updatedNewCard = Factory.card({[titleField.id]: newTitle}, newCard);
      cy.intercept('PATCH', `http://cypressapi/cards/${newCard.id}?`, {
        success: true,
      }).as('updateNewCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [updatedNewCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${updatedNewCard.id}?`, {
        data: updatedNewCard,
      });

      cy.get(`[data-testid=text-input-${titleField.id}]`).type(newTitle);
      cy.wait('@updateNewCard');

      cy.get('[aria-label="Close card"]').click();
      cy.contains(newTitle);
    });
  });
});
