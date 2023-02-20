import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
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

    const releasedCard = Factory.card({
      [titleField.id]: 'Final Fantasy 7',
      [publisherField.id]: 'Square Enix',
      [releasedAtField.id]: '1997-01-31',
    });
    const unreleasedCard = Factory.card({
      [titleField.id]: 'Castlevania: Symphony of the Night',
      [publisherField.id]: 'Konami',
    });
    const cards = [releasedCard, unreleasedCard];

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [titleField, publisherField, releasedAtField],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [releasedColumn, unreleasedColumn],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: cards,
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.step('VERIFY RELEASED COLUMN', () => {
      cy.contains('Released');
      cy.get(`[data-testid=column-${releasedColumn.id}]`).contains(
        releasedCard.attributes['field-values'][titleField.id],
      );
      cy.contains('Jan 31, 1997'); // release date
    });

    cy.step('VERIFY UNRELEASED COLUMN', () => {
      cy.contains('Unreleased');
      cy.get(`[data-testid=column-${unreleasedColumn.id}]`).contains(
        unreleasedCard.attributes['field-values'][titleField.id],
      );
    });

    cy.step('VERIFY COLUMNS NOT SHOWN IN SUMMARY', () => {
      cy.contains(
        releasedCard.attributes['field-values'][publisherField.id],
      ).should('not.exist');
    });
  });
});
