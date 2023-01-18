import FIELD_DATA_TYPES from '../../src/fieldDataTypes';
import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
    const greetingField = Factory.field({
      name: 'Greeting',
      'data-type': FIELD_DATA_TYPES.text,
      'show-in-summary': true,
    });

    const allColumn = Factory.column({
      name: 'All',
      'card-inclusion-condition': null,
    });

    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [],
    });
    cy.intercept('GET', 'http://cypressapi/columns?', {
      data: [allColumn],
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [],
    });

    cy.visit('/');

    cy.log('ADD FIELD');

    cy.contains('Edit Elements').click();
    cy.contains('Add Field').click();
    const fieldName = 'Greeting';
    cy.get('[data-testid="text-input-field-name"]').type(fieldName);

    // TODO: set other element fields: data type etc

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: greetingField,
    }).as('addField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField],
    });
    cy.contains('Save Field').click();
    cy.wait('@addField');
    cy.contains(fieldName);
    cy.contains('Done Editing Elements').click();

    const newCard = Factory.card({});
    cy.intercept('POST', 'http://cypressapi/cards?', {
      data: newCard,
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [newCard],
    });
    cy.contains('Add Card').click();
    const greeting = 'Hello, World!';
    cy.get(`[data-testid="text-input-${greetingField.id}"]`).type(
      'Hello, World!',
    );
    cy.intercept('PATCH', `http://cypressapi/cards/${newCard.id}?`, {
      success: true,
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [Factory.card({[greetingField.id]: greeting})],
    });
    cy.contains('Save').click();
    cy.contains(greeting);
  });
});
