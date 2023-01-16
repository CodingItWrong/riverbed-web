import FIELD_DATA_TYPES from '../../src/fieldDataTypes';
import QUERIES from '../../src/queries';
import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';

  it('allows clicking buttons to perform actions', () => {
    const titleField = Factory.field({
      name: 'Title',
      'data-type': FIELD_DATA_TYPES.text,
      'show-in-summary': true,
    });
    const releasedAtField = Factory.field({
      name: 'Released At',
      'data-type': FIELD_DATA_TYPES.date,
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
    });

    const releasedColumn = Factory.column({
      name: 'Released',
      filter: {
        field: releasedAtField.id,
        function: QUERIES.IS_NOT_EMPTY,
      },
    });
    const unreleasedColumn = Factory.column({
      name: 'Unreleased',
      filter: {
        field: releasedAtField.id,
        function: QUERIES.IS_EMPTY,
      },
    });

    const elements = [titleField, releasedAtField, releaseButton];
    const card = Factory.card({
      [titleField.id]: title,
    });
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: elements,
    });
    cy.intercept('http://cypressapi/columns?', {
      data: [releasedColumn, unreleasedColumn],
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [card],
    });

    cy.visit('/');

    cy.log('SET VALUE TO NOW');

    cy.get(`[data-testid="column-${unreleasedColumn.id}"]`)
      .contains(title)
      .click();
    cy.get(`[data-testid=button-${releaseButton.id}]`).click();

    const updatedCard = Factory.card(
      {[releasedAtField.id]: '2023-01-01'},
      card,
    );
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard');
    cy.intercept('GET', 'http://cypressapi/cards?', {data: [updatedCard]});

    cy.contains('Save').click();

    cy.get(`[data-testid="column-${releasedColumn.id}"]`).contains(title);
  });
});
