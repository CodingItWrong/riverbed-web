import COMMANDS from '../../src/enums/commands';
import ELEMENT_TYPES from '../../src/enums/elementTypes';
import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import VALUES from '../../src/enums/values';
import Factory from '../support/Factory';

describe('edit elements', () => {
  const board = Factory.board({name: 'Video Games'});
  const allColumn = Factory.column({
    name: 'All',
    'card-inclusion-condition': null,
  });

  beforeEach(() => {
    cy.intercept('http://cypressapi/boards?', {data: [board]});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/columns?`, {
      data: [allColumn],
    });
  });

  it('allows creating, updating, and deleting fields', () => {
    const newField = Factory.field({
      'element-type': ELEMENT_TYPES.FIELD.key,
      name: '',
    });
    const greetingField = Factory.field(
      {
        name: 'Greeting',
        'data-type': FIELD_DATA_TYPES.TEXT.key,
        'show-in-summary': true,
      },
      newField,
    );

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [],
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.log('ADD FIELD');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newField,
    }).as('addField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [newField],
    });

    cy.contains(/^Add$/).click();
    cy.contains(/^Field$/).click({force: true});

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
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
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
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
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
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [Factory.card({[greetingField.id]: greeting})],
    });
    cy.contains('Save').click();
    cy.wait('@updateField');
    cy.contains(greeting);

    cy.log('EDIT FIELD');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.get(`[aria-label="Edit ${fieldName} field"]`).click();
    cy.get('[data-testid="text-input-element-name"]')
      .invoke('val')
      .then(value => expect(value).to.equal(fieldName));

    cy.contains('Cancel').click();
    cy.get('[data-testid="text-input-element-name"]').should('not.exist');
    cy.get(`[aria-label="Edit ${fieldName} field"]`).click();

    const updatedFieldName = 'Salutation';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedFieldName);
    const updatedGreetingField = Factory.field(
      {name: updatedFieldName},
      greetingField,
    );
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [updatedGreetingField],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateField');
    cy.contains('Save Element').should('not.exist');
    cy.contains(updatedFieldName);

    cy.log('DELETE FIELD');

    cy.get(`[aria-label="Edit ${updatedFieldName} field"]`).click();
    cy.intercept('DELETE', `http://cypressapi/elements/${greetingField.id}`, {
      success: true,
    }).as('deleteField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.contains('Delete Element').click();
    cy.wait('@deleteField');
    cy.contains(updatedFieldName).should('not.exist');
  });

  it('allows creating, updating, and deleting buttons', () => {
    const greetingField = Factory.field({
      name: 'Greeting',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });

    const newButton = Factory.button({});
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button(
      {
        name: buttonName,
        action: {
          command: COMMANDS.SET_VALUE.key,
          field: greetingField.id,
          value: VALUES.EMPTY.key,
        },
        'show-condition': {
          query: QUERIES.IS_NOT_EMPTY.key,
          field: greetingField.id,
        },
      },
      newButton,
    );

    const greetingText = 'Hello, world!';
    const card = Factory.card({[greetingField.id]: greetingText});

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.log('ADD BUTTON');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newButton,
    }).as('addButton');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, newButton],
    });

    cy.contains(/^Add$/).click();
    cy.contains(/^Button$/).click({force: true});

    cy.wait('@addButton')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'elements',
          relationships: {
            board: {data: {type: 'boards', id: String(board.id)}},
          },
          attributes: {'element-type': ELEMENT_TYPES.BUTTON.key},
        },
      });

    cy.get('[data-testid="text-input-element-name"]').type(buttonName);

    // action
    cy.contains('Command: (choose)').paperSelect('Set Value');
    // TODO: make this reliable to select when it's just the field name shown, not conflicting with other things on the page
    cy.contains('Action Field: (choose)').paperSelect('Greeting');
    cy.contains('Value: (choose)').paperSelect('Empty');

    // show condition
    // TODO: why are these order dependent?
    cy.contains('Show Condition: (choose)').paperSelect('Not Empty');
    // cy.contains(/^\(choose\)$/).should('not.exist');
    cy.contains('Query Field: (choose)').paperSelect('Greeting');
    // cy.contains(/^\(choose\)$/).should('not.exist');

    cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
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
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [quietedCard],
    });
    cy.contains(buttonName).click();
    cy.wait('@updateCard')
      .its('request.body')
      .should('deep.equal', {data: quietedCard});
    cy.contains(greetingText).should('not.exist');

    cy.get(`[data-testid="card-${quietedCard.id}"]`).click();
    cy.contains(buttonName).should('not.exist');

    cy.log('EDIT BUTTON');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.get(`[aria-label="Edit ${buttonName} button"]`).click();

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
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, renamedButton],
    });

    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: renamedButton});
    cy.contains(updatedButtonName);

    cy.log('DELETE BUTTON');

    cy.get(`[aria-label="Edit ${updatedButtonName} button"]`).click();

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.intercept('DELETE', `http://cypressapi/elements/${renamedButton.id}`, {
      success: true,
    }).as('deleteButton');
    cy.contains('Delete Element').click();
    cy.wait('@deleteButton');

    cy.contains(updatedButtonName).should('not.exist');
  });

  it('allows ordering elements', () => {
    const fieldA = Factory.field({
      name: 'Field A',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });
    const fieldB = Factory.field({
      name: 'Field B',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });
    const card = Factory.card({
      [fieldA.id]: 'Value A',
      [fieldB.id]: 'Value B',
    });

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [fieldA, fieldB],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });

    cy.signIn();
    cy.contains('Video Games').click();

    // confirm initial order in summary
    cy.assertContentsOrder('[data-testid="field-value"]', [
      'Value A',
      'Value B',
    ]);

    // confirm initial order in card detail
    cy.contains('Value A').click();
    cy.assertTestIdOrder('[data-testid^="element-"]', [
      `element-${fieldA.id}`,
      `element-${fieldB.id}`,
    ]);
    cy.contains('Cancel').click();

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    // confirm initial order in Edit Elements form
    cy.assertTestIdOrder('[data-testid^="element-"]', [
      `element-${fieldA.id}`,
      `element-${fieldB.id}`,
    ]);

    cy.get('[aria-label="Edit Field A field"]').click();
    cy.get('[data-testid="number-input-order"]').type(2);
    const orderedFieldA = Factory.field({'display-order': 2}, fieldA);
    cy.intercept('PATCH', `http://cypressapi/elements/${fieldA.id}?`, {
      success: true,
    }).as('updateFieldA');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [orderedFieldA, fieldB],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateFieldA')
      .its('request.body')
      .should('deep.equal', {data: orderedFieldA});
    cy.contains('Save Element').should('not.exist');

    cy.get('[aria-label="Edit Field B field"]').click();
    cy.get('[data-testid="number-input-order"]').type(1);
    const orderedFieldB = Factory.field({'display-order': 1}, fieldB);
    cy.intercept('PATCH', `http://cypressapi/elements/${fieldB.id}?`, {
      success: true,
    }).as('updateFieldB');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [orderedFieldA, orderedFieldB],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateFieldB')
      .its('request.body')
      .should('deep.equal', {data: orderedFieldB});
    cy.contains('Save Element').should('not.exist');

    // confirm new field order in Edit Elements form
    cy.assertTestIdOrder('[data-testid^="element-"]', [
      `element-${fieldB.id}`,
      `element-${fieldA.id}`,
    ]);

    cy.contains('Done Editing Elements').click();

    // confirm new field order in card summary
    cy.assertContentsOrder('[data-testid="field-value"]', [
      'Value B',
      'Value A',
    ]);

    // confirm new order in card detail
    cy.contains('Value A').click();
    cy.assertTestIdOrder('[data-testid^="element-"]', [
      `element-${fieldB.id}`,
      `element-${fieldA.id}`,
    ]);
  });

  it('allows setting initial values for fields', () => {
    const dateField = Factory.field({
      name: 'Date',
      'data-type': FIELD_DATA_TYPES.DATE.key,
    });
    const dateTimeField = Factory.field({
      name: 'Date and Time',
      'data-type': FIELD_DATA_TYPES.DATETIME.key,
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [dateField, dateTimeField],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [],
    });

    cy.signIn();
    cy.contains('Video Games').click();

    cy.step('EDIT ELEMENTS', () => {
      cy.get('[aria-label="Board Menu"]').click();
      cy.contains('Edit Elements').click({force: true});
    });

    const updatedDateField = Factory.field(
      {'initial-value': VALUES.NOW.key},
      dateField,
    );
    cy.step('SET INITIAL DATE VALUE TO NOW', () => {
      cy.get('[aria-label="Edit Date field"]').click();
      cy.contains('Initial Value: (choose)').paperSelect('Now');

      cy.intercept('PATCH', `http://cypressapi/elements/${dateField.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
        data: [updatedDateField, dateTimeField],
      });
      cy.contains('Save Element').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: updatedDateField});
    });

    const updatedDateTimeField = Factory.field(
      {'initial-value': VALUES.NOW.key},
      dateTimeField,
    );
    cy.step('SET INITIAL DATETIME VALUE TO NOW', () => {
      cy.get('[aria-label="Edit Date and Time field"]').click();
      cy.contains('Initial Value: (choose)').paperSelect('Now');

      cy.intercept('PATCH', `http://cypressapi/elements/${dateTimeField.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
        data: [updatedDateField, updatedDateTimeField],
      }).as('elementList');
      cy.contains('Save Element').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: updatedDateTimeField});
      cy.wait('@elementList'); // to make sure the updated elements are loaded before proceeding
    });

    cy.step('FINISH EDITING ELEMENTS', () => {
      cy.contains('Done Editing Elements').click();
    });

    const nowString = '2023-01-01T12:00:00.000Z';
    cy.clock(new Date(nowString));

    cy.step('ADD NEW CARD', () => {
      const newCard = Factory.card();
      cy.intercept('POST', 'http://cypressapi/cards?', {data: newCard}).as(
        'createCard',
      );
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [newCard],
      });
      cy.contains('Add Card').click();
    });

    cy.step('CONFIRM INITIAL VALUES SET IN REQUEST TO SERVER', () => {
      cy.wait('@createCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.equal', {
          [updatedDateField.id]: '2023-01-01',
          [updatedDateTimeField.id]: nowString,
        });
    });
  });
});
