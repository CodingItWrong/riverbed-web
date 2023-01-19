import ELEMENT_TYPES from '../../src/elementTypes';
import FIELD_DATA_TYPES from '../../src/fieldDataTypes';
import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
    const newField = Factory.field({
      'element-type': ELEMENT_TYPES.field,
      name: '',
    });
    const greetingField = Factory.field(
      {
        name: 'Greeting',
        'data-type': FIELD_DATA_TYPES.text,
        'show-in-summary': true,
      },
      newField,
    );

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

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newField,
    }).as('addField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [newField],
    });
    cy.contains('Add Field').click();
    cy.wait('@addField');
    const fieldName = 'Greeting';
    cy.get('[data-testid="text-input-field-name"]').type(fieldName);
    cy.contains('Data Type: (choose)').click();
    cy.contains('Text').click({force: true});
    cy.get('[data-testid="checkbox-show-in-summary"]').click();

    // TODO: set other element fields: read only, show condition, etc

    cy.intercept('PATCH', `http://cypressapi/elements/${newField.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField],
    });
    cy.contains('Save Field').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: greetingField});
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
    }).as('updateField');
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [Factory.card({[greetingField.id]: greeting})],
    });
    cy.contains('Save').click();
    cy.wait('@updateField');
    cy.contains(greeting);

    cy.log('EDIT FIELD');

    cy.contains('Edit Elements').click();
    cy.contains(fieldName).click();
    cy.get('[data-testid="text-input-field-name"]')
      .invoke('val')
      .then(value => expect(value).to.equal(fieldName));

    cy.contains('Cancel').click();
    cy.get('[data-testid="text-input-field-name"]').should('not.exist');
    cy.contains(fieldName).click();

    const updatedFieldName = 'Salutation';
    cy.get('[data-testid="text-input-field-name"]')
      .clear()
      .type(updatedFieldName);
    const updatedGreetingField = Factory.field(
      {name: updatedFieldName},
      greetingField,
    );
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [updatedGreetingField],
    });
    cy.contains('Save Field').click();
    cy.wait('@updateField');
    cy.contains(updatedFieldName);

    cy.log('DELETE FIELD');

    cy.contains(updatedFieldName).click();
    cy.intercept('DELETE', `http://cypressapi/elements/${greetingField.id}`, {
      success: true,
    }).as('deleteField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [],
    });
    cy.contains('Delete Field').click();
    cy.wait('@deleteField');
    cy.contains(updatedFieldName).should('not.exist');
  });
});
