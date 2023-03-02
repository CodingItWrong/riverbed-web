import ELEMENT_TYPES from '../../src/enums/elementTypes';
import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import VALUES from '../../src/enums/values';
import Factory from '../support/Factory';

describe('edit fields', () => {
  const boardName = 'Sample Board';
  const board = Factory.board({name: boardName});
  const allColumn = Factory.column({
    name: 'All',
    'card-inclusion-condition': null,
  });

  const greetingFieldName = 'Greeting';
  const greetingField = Factory.field({
    name: greetingFieldName,
    'data-type': FIELD_DATA_TYPES.TEXT.key,
    'show-in-summary': true,
  });

  beforeEach(() => {
    cy.intercept('GET', 'http://cypressapi/boards?', {data: [board]});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [allColumn],
    });
  });

  function goToBoard() {
    cy.signIn();
    cy.contains(boardName).click();
  }

  it('allows creating fields', () => {
    const newField = Factory.field({
      'element-type': ELEMENT_TYPES.FIELD.key,
      name: '',
    });
    const localGreetingField = Factory.field(
      {
        name: 'Greeting',
        'data-type': FIELD_DATA_TYPES.TEXT.key,
        'show-in-summary': true,
      },
      newField,
    );
    const card = Factory.card({});

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.step('ADD FIELD', () => {
      cy.get(`[data-testid=card-${card.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newField,
      }).as('addField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [newField],
      });

      cy.contains('Add Element').paperSelect('Field');

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
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [localGreetingField],
      });
      cy.contains('Save Field').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: localGreetingField});
      cy.contains(fieldName);
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('CONFIRM CARD HAS FIELD', () => {
      const greeting = 'Hello, World!';
      cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [Factory.card({[localGreetingField.id]: greeting})],
      });
      cy.get(`[data-testid="text-input-${localGreetingField.id}"]`).type(
        'Hello, World!',
      );
      cy.wait('@updateField');

      cy.get('[aria-label="Close card"]').click();
      cy.contains(greeting);
    });
  });

  it('allows updating fields', () => {
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    const card = Factory.card({});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.intercept('PATCH', `http://cypressapi/elements/${greetingField.id}?`, {
      success: true,
    }).as('updateField');

    cy.get(`[data-testid=card-${card.id}]`).click();
    cy.get('[aria-label="Edit Elements"]').click();

    cy.get(`[aria-label="Edit ${greetingFieldName} field"]`).click();
    cy.get('[data-testid="text-input-element-name"]')
      .invoke('val')
      .should('eq', greetingFieldName);

    cy.contains('Cancel').click();
    cy.get('[data-testid="text-input-element-name"]').should('not.exist');
    cy.get(`[aria-label="Edit ${greetingFieldName} field"]`).click();

    const updatedFieldName = 'Salutation';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedFieldName);
    const updatedGreetingField = Factory.field(
      {name: updatedFieldName},
      greetingField,
    );
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [updatedGreetingField],
    });
    cy.contains('Save Field').click();
    cy.wait('@updateField');
    cy.contains('Save Field').should('not.exist');
    cy.contains(updatedFieldName);
  });

  it('allows deleting fields', () => {
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    const card = Factory.card({});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.log('DELETE FIELD');

    cy.get(`[data-testid=card-${card.id}]`).click();
    cy.get('[aria-label="Edit Elements"]').click();

    cy.get(`[aria-label="Edit ${greetingFieldName} field"]`).click();
    cy.intercept('DELETE', `http://cypressapi/elements/${greetingField.id}`, {
      success: true,
    }).as('deleteField');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.contains('Delete Field').click();
    cy.wait('@deleteField');
    cy.contains(greetingFieldName).should('not.exist');
  });

  it('allows creating choice fields', () => {
    const card = Factory.card({});
    const newField = Factory.field({
      'element-type': ELEMENT_TYPES.FIELD.key,
      name: '',
    });
    const choiceField = Factory.field(
      {
        name: 'Color',
        'data-type': FIELD_DATA_TYPES.CHOICE.key,
        'show-in-summary': true,
        options: {
          choices: [
            {id: 'fake_uuid_1', label: 'Red'},
            {id: 'fake_uuid_2', label: 'Green'},
          ],
        },
      },
      newField,
    );

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.step('ADD FIELD', () => {
      cy.get(`[data-testid=card-${card.id}]`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newField,
      }).as('addField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [newField],
      });

      cy.contains('Add Element').paperSelect('Field');

      cy.wait('@addField');
    });

    cy.step('CONFIGURE FIELD', () => {
      // name
      const fieldName = 'Color';
      cy.get('[data-testid="text-input-element-name"]').type(fieldName);

      // data type: choice
      cy.contains('Data Type: (choose)').paperSelect('Choice');
      cy.contains('Data Type: Choice');
      cy.get('[data-testid="checkbox-show-in-summary"]').click();

      // options
      cy.contains('Add Choice').click();
      cy.get('[data-testid=text-input-choice-0-label').type('Red');

      cy.contains('Add Choice').click();
      cy.get('[data-testid=text-input-choice-1-label').type('Green');

      cy.intercept('PATCH', `http://cypressapi/elements/${newField.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [choiceField],
      });
      cy.contains('Save Field').click();
      cy.wait('@updateField')
        .its('request.body.data.attributes.options.choices')
        .then(choices => {
          expect(choices.length).to.equal(2);
          expect(choices.map(c => typeof c.id)).to.deep.equal([
            'string',
            'string',
          ]);
          expect(choices.map(c => c.label)).to.deep.equal(['Red', 'Green']);
        });
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('CONFIRM CARD HAS CHOICES', () => {
      const updatedCard = Factory.card({[choiceField.id]: 'fake_uuid_2'}, card);
      cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [updatedCard],
      });
      cy.contains('Color: (choose)').paperSelect('Green');
      cy.contains('Color: Green');
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {
          data: {
            type: 'cards',
            id: card.id,
            attributes: {
              'field-values': {[choiceField.id]: 'fake_uuid_2'},
            },
          },
        });

      cy.get('[aria-label="Close card"]').click();
      cy.contains('Color: Green').should('not.exist');
      cy.contains('Green');
    });
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

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [fieldA, fieldB],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    // confirm initial order in summary
    cy.assertOrder('[data-testid="field-value"]', [
      e => e.contains('Value A'),
      e => e.contains('Value B'),
    ]);

    // confirm initial order in card detail
    cy.contains('Value A').click();
    cy.assertOrder('[data-testid^="element-"]', [
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldA.id}`),
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldB.id}`),
    ]);
    cy.get('[aria-label="Close card"]').click();

    cy.get(`[data-testid=card-${card.id}]`).click();
    cy.get('[aria-label="Edit Elements"]').click();

    // confirm initial order in Edit Elements form
    cy.assertOrder('[data-testid^="element-"]', [
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldA.id}`),
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldB.id}`),
    ]);

    cy.get('[aria-label="Edit Field A field"]').click();
    cy.get('[data-testid="number-input-order"]').type(2);
    const orderedFieldA = Factory.field({'display-order': 2}, fieldA);
    cy.intercept('PATCH', `http://cypressapi/elements/${fieldA.id}?`, {
      success: true,
    }).as('updateFieldA');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [orderedFieldA, fieldB],
    });
    cy.contains('Save Field').click();
    cy.wait('@updateFieldA')
      .its('request.body')
      .should('deep.equal', {data: orderedFieldA});
    cy.contains('Save Field').should('not.exist');

    cy.get('[aria-label="Edit Field B field"]').click();
    cy.get('[data-testid="number-input-order"]').type(1);
    const orderedFieldB = Factory.field({'display-order': 1}, fieldB);
    cy.intercept('PATCH', `http://cypressapi/elements/${fieldB.id}?`, {
      success: true,
    }).as('updateFieldB');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [orderedFieldA, orderedFieldB],
    });
    cy.contains('Save Field').click();
    cy.wait('@updateFieldB')
      .its('request.body')
      .should('deep.equal', {data: orderedFieldB});
    cy.contains('Save Field').should('not.exist');

    // confirm new field order in Edit Elements form
    cy.assertOrder('[data-testid^="element-"]', [
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldB.id}`),
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldA.id}`),
    ]);

    cy.get('[aria-label="Done Editing Elements"]').click();

    // confirm new field order in card summary
    cy.assertOrder('[data-testid="field-value"]', [
      e => e.contains('Value B'),
      e => e.contains('Value A'),
    ]);

    // confirm new order in card detail
    cy.assertOrder('[data-testid^="element-"]', [
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldB.id}`),
      e => e.invoke('attr', 'data-testid').should('eq', `element-${fieldA.id}`),
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
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [dateField, dateTimeField],
    });
    const card = Factory.card({});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.step('EDIT ELEMENTS', () => {
      cy.get(`[data-testid=card-${card.id}]`).click();
      cy.get('[aria-label="Edit Elements"]').click();
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
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [updatedDateField, dateTimeField],
      });
      cy.contains('Save Field').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: updatedDateField});
      cy.contains('Save Field').should('not.exist');
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
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [updatedDateField, updatedDateTimeField],
      }).as('elementList');
      cy.contains('Save Field').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: updatedDateTimeField});
      cy.wait('@elementList'); // to make sure the updated elements are loaded before proceeding
    });

    cy.step('FINISH EDITING ELEMENTS', () => {
      cy.get('[aria-label="Done Editing Elements"]').click();
      cy.get('[aria-label="Close card"]').click();
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
