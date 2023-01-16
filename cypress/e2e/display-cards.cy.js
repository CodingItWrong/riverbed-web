import FIELD_DATA_TYPES from '../../src/fieldDataTypes';
import USER_FUNCTIONS from '../../src/userFunctions';
import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
    const titleField = Factory.field({
      name: 'Title',
      'data-type': FIELD_DATA_TYPES.text,
      'show-in-summary': true,
    });
    const publisherField = Factory.field({
      name: 'Publisher',
      'data-type': FIELD_DATA_TYPES.text,
      'show-in-summary': false,
    });
    const releasedAtField = Factory.field({
      name: 'Released At',
      'data-type': FIELD_DATA_TYPES.date,
      'show-in-summary': true,
    });

    const releasedColumn = Factory.column({
      name: 'Released',
      filter: {
        field: releasedAtField.id,
        function: USER_FUNCTIONS.IS_NOT_EMPTY,
      },
    });
    const unreleasedColumn = Factory.column({
      name: 'Unreleased',
      filter: {
        field: releasedAtField.id,
        function: USER_FUNCTIONS.IS_EMPTY,
      },
    });

    const cards = [
      Factory.card({
        [titleField.id]: 'Final Fantasy 7',
        [publisherField.id]: 'Square Enix',
        [releasedAtField.id]: '1997-01-31',
      }),
      Factory.card({
        [titleField.id]: 'Castlevania: Symphony of the Night',
        [publisherField.id]: 'Konami',
      }),
    ];

    cy.intercept('http://cypressapi/fields?', {
      data: [titleField, publisherField, releasedAtField],
    });
    cy.intercept('http://cypressapi/columns?', {
      data: [releasedColumn, unreleasedColumn],
    });
    cy.intercept('http://cypressapi/cards?', {
      data: cards,
    });

    cy.visit('/');

    cy.get(`[data-testid=column-${releasedColumn.id}]`).contains(
      cards[0].attributes['field-values'][titleField.id],
    );
    cy.contains('Jan 31, 1997');
    cy.get(`[data-testid=column-${unreleasedColumn.id}]`).contains(
      cards[1].attributes['field-values'][titleField.id],
    );
    cy.contains(cards[0].attributes['field-values'][publisherField.id]).should(
      'not.exist',
    );
  });
});
