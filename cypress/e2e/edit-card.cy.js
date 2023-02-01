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
      'card-inclusion-condition': {
        field: releasedAtField.id,
        query: QUERIES.IS_NOT_EMPTY.key,
      },
    });
    const unreleasedColumn = Factory.column({
      name: 'Unreleased',
      'card-inclusion-condition': {
        field: releasedAtField.id,
        query: QUERIES.IS_EMPTY.key,
      },
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

    cy.visit('/');
    cy.contains('Video Games').click();

    cy.log('SHOW DETAIL');
    cy.get(`[data-testid="column-${unreleasedColumn.id}"]`)
      .contains(title)
      .click();
    cy.get(`[data-testid="text-input-${publisherField.id}"]`)
      .invoke('val')
      .then(value => expect(value).to.equal(publisher));

    cy.log('HIDE DETAIL');
    cy.contains('Cancel').click();
    cy.contains(publisher).should('not.exist');

    cy.log('EDIT CARD');
    const updatedCard = Factory.card(
      {[titleField.id]: updatedTitle, [releasedAtField.id]: '2000-01-01'},
      card,
    );
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard1');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [updatedCard],
    });

    cy.contains(card.attributes['field-values'][titleField.id]).click();
    cy.get(`[data-testid=text-input-${titleField.id}]`)
      .clear()
      .type(updatedTitle);
    cy.get(`[data-testid="date-input-${releasedAtField.id}"]`)
      .clear()
      .type('01/01/2000');
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {data: updatedCard});

    cy.contains(card.attributes['field-values'][titleField.id]).should(
      'not.exist',
    );
    cy.contains(card.attributes['field-values'][publisherField.id]).should(
      'not.exist',
    );
    cy.get(`[data-testid=column-${releasedColumn.id}]`).contains(updatedTitle);
    cy.contains('Jan 1, 2000');

    cy.log('DELETE CARD');
    cy.intercept('DELETE', `http://cypressapi/cards/${card.id}`, {
      success: true,
    }).as('deleteCard');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [],
    });

    cy.contains(updatedTitle).click();
    cy.contains('Delete').click();
    cy.wait('@deleteCard');
    cy.contains(updatedTitle).should('not.exist');

    cy.log('CREATE CARD');
    const newCard = Factory.card();
    cy.intercept('POST', 'http://cypressapi/cards?', {data: newCard}).as(
      'createCard',
    );
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [newCard],
    });
    cy.contains('Add Card').click();
    cy.wait('@createCard')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'cards',
          relationships: {
            board: {data: {type: 'boards', id: String(board.id)}},
          },
          attributes: {},
        },
      });
    cy.get(`[data-testid=text-input-${titleField.id}]`).clear().type(newTitle);
    const updatedNewCard = Factory.card({[titleField.id]: newTitle}, newCard);
    cy.intercept('PATCH', `http://cypressapi/cards/${newCard.id}?`, {
      success: true,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [updatedNewCard],
    });

    cy.contains('Save').click();
    cy.contains(newTitle);
  });
});
