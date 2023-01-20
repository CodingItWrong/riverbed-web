import COMMANDS from '../../src/commands';
import ELEMENT_TYPES from '../../src/elementTypes';
import FIELD_DATA_TYPES from '../../src/fieldDataTypes';
import Factory from '../support/Factory';

describe('edit elements', () => {
  it('allows creating, updating, and deleting fields', () => {
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
    cy.get('[data-testid="text-input-element-name"]').type(fieldName);
    cy.contains('Data Type: (choose)').paperSelect('Text');
    cy.contains('Data Type: Text');
    cy.get('[data-testid="checkbox-show-in-summary"]').click();

    // TODO: set other element fields: show condition, etc

    cy.intercept('PATCH', `http://cypressapi/elements/${newField.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField],
    });
    cy.contains('Save Element').click();
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
    cy.get('[data-testid="text-input-element-name"]')
      .invoke('val')
      .then(value => expect(value).to.equal(fieldName));

    cy.contains('Cancel').click();
    cy.get('[data-testid="text-input-element-name"]').should('not.exist');
    cy.contains(fieldName).click();

    const updatedFieldName = 'Salutation';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedFieldName);
    const updatedGreetingField = Factory.field(
      {name: updatedFieldName},
      greetingField,
    );
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [updatedGreetingField],
    });
    cy.contains('Save Element').click();
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
    cy.contains('Delete Element').click();
    cy.wait('@deleteField');
    cy.contains(updatedFieldName).should('not.exist');
  });

  it('allows creating, updating, and deleting buttons', () => {
    const greetingField = Factory.field({
      name: 'Greeting',
      'data-type': FIELD_DATA_TYPES.text,
      'show-in-summary': true,
    });

    const newButton = Factory.button({});
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button(
      {
        name: buttonName,
        action: {
          command: COMMANDS.SET_VALUE,
          field: greetingField.id,
          value: 'EMPTY',
        },
      },
      newButton,
    );

    const allColumn = Factory.column({
      name: 'All',
      'card-inclusion-condition': null,
    });

    const greetingText = 'Hello, world!';
    const card = Factory.card({[greetingField.id]: greetingText});

    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField],
    });
    cy.intercept('GET', 'http://cypressapi/columns?', {
      data: [allColumn],
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [card],
    });

    cy.visit('/');

    cy.log('ADD BUTTON');

    cy.contains('Edit Elements').click();

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newButton,
    }).as('addButton');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField, newButton],
    });
    cy.contains('Add Button').click();
    cy.wait('@addButton');

    cy.get('[data-testid="text-input-element-name"]').type(buttonName);
    cy.contains('Command: (choose)').paperSelect('Set Value');
    // TODO: make this reliable to select when it's just the field name shown, not conflicting with other things on the page
    cy.contains('Field: (choose)').paperSelect('In Greeting');
    cy.contains('Value: (choose)').paperSelect('Empty');

    cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField, greetButton],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: greetButton});
    cy.contains(buttonName);
    cy.contains('Done Editing Elements').click();

    cy.contains(greetingText).click();

    const quietedCard = Factory.card({[greetingField.id]: null}, card);
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard');
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [quietedCard],
    });
    cy.contains(buttonName).click();
    cy.wait('@updateCard')
      .its('request.body')
      .should('deep.equal', {data: quietedCard});
    cy.contains(greetingText).should('not.exist');

    cy.log('EDIT BUTTON');

    cy.contains('Edit Elements').click();
    cy.contains(buttonName).click();

    const updatedButtonName = 'Shoosh';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedButtonName);

    const renamedButton = Factory.button(
      {name: updatedButtonName},
      greetButton,
    );
    cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField, renamedButton],
    });

    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: renamedButton});
    cy.contains(updatedButtonName);

    cy.log('DELETE BUTTON');

    cy.contains(updatedButtonName).click();

    cy.intercept('GET', 'http://cypressapi/elements?', {
      data: [greetingField],
    });
    cy.intercept('DELETE', `http://cypressapi/elements/${renamedButton.id}`, {
      success: true,
    }).as('deleteButton');
    cy.contains('Delete Element').click();
    cy.wait('@deleteButton');

    cy.contains(updatedButtonName).should('not.exist');
  });
});
