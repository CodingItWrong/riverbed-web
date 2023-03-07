import COMMANDS from '../../src/enums/commands';
import ELEMENT_TYPES from '../../src/enums/elementTypes';
import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import VALUES from '../../src/enums/values';
import Factory from '../support/Factory';

describe('edit buttons', () => {
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

  const greetedAtField = Factory.field({
    name: 'Greeted At',
    'data-type': FIELD_DATA_TYPES.DATE.key,
    'show-in-summary': true,
  });

  const greetingText = 'Hello, world!';
  const greetingCard = Factory.card({[greetingField.id]: greetingText});

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

  it('allows creating buttons', () => {
    const newButton = Factory.button({});
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button(
      {
        name: buttonName,
        options: {
          actions: [
            {
              command: COMMANDS.SET_VALUE.key,
              field: greetingField.id,
              value: VALUES.EMPTY.key,
            },
          ],
        },
        'show-condition': {
          query: QUERIES.IS_NOT_EMPTY.key,
          field: greetingField.id,
        },
      },
      newButton,
    );

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [greetingCard],
    });
    cy.intercept('GET', `http://cypressapi/cards/${greetingCard.id}?`, {
      data: greetingCard,
    });

    goToBoard();

    cy.step('CREATE BUTTON', () => {
      cy.get(`[data-testid=card-${greetingCard.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newButton,
      }).as('addButton');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetingField, newButton],
      });

      cy.contains('Add Element').paperSelect('Button');

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
    });

    cy.step('CONFIGURE BUTTON', () => {
      cy.get('[data-testid="text-input-element-name"]').type(buttonName);

      // action
      cy.contains('Add Action').click();
      cy.contains('Command: (choose)').paperSelect('Set Value');
      // TODO: make this reliable to select when it's just the field name shown, not conflicting with other things on the page
      cy.contains('Action Field: (choose)').paperSelect('Greeting');
      cy.contains('Value: (choose)').paperSelect(VALUES.EMPTY.label);

      // show condition
      // TODO: why are these order dependent?
      cy.contains('Show Condition: (choose)').paperSelect(
        QUERIES.IS_NOT_EMPTY.label,
      );
      cy.contains('Query Field: (choose)').paperSelect('Greeting');

      cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetingField, greetButton],
      });
      cy.contains('Save Button').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: greetButton});
      cy.contains(buttonName);
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('CONFIRM BUTTON ACTION WORKS', () => {
      const quietedCard = Factory.card(
        {[greetingField.id]: null},
        greetingCard,
      );
      cy.intercept('PATCH', `http://cypressapi/cards/${greetingCard.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [quietedCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${quietedCard.id}?`, {
        data: quietedCard,
      });
      cy.contains(buttonName).click();
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {data: quietedCard});
    });

    cy.step('CONFIRM BUTTON IS CONDITIONALLY HIDDEN', () => {
      cy.contains(buttonName).should('not.exist');
    });

    cy.step('CONFIRM INFO CLEARED IN LIST', () => {
      cy.contains(greetingText).should('not.exist');
    });
  });

  it('allows updating buttons', () => {
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button({name: buttonName});

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, greetButton],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [greetingCard],
    });
    cy.intercept('GET', `http://cypressapi/cards/${greetingCard.id}?`, {
      data: greetingCard,
    });

    goToBoard();

    const updatedButtonName = 'Shoosh';

    cy.step('EDIT BUTTON', () => {
      cy.get(`[data-testid=card-${greetingCard.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();
      cy.get(`[aria-label="Edit ${buttonName} button"]`).click();

      cy.get('[data-testid="text-input-element-name"]')
        .clear()
        .type(updatedButtonName);

      const renamedButton = Factory.button(
        {name: updatedButtonName},
        greetButton,
      );
      cy.intercept('PATCH', `http://cypressapi/elements/${greetButton.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetingField, renamedButton],
      });

      cy.contains('Save Button').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: renamedButton});
    });

    cy.step('CONFIRM BUTTON EDITED IN ELEMENT LIST', () => {
      cy.contains(updatedButtonName);
    });

    cy.step('CONFIRM BUTTON EDITED ON CARD', () => {
      cy.get('[aria-label="Done Editing Elements"]').click();
      cy.contains(updatedButtonName);
    });
  });

  it('allows deleting buttons', () => {
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button({name: buttonName});

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, greetButton],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [greetingCard],
    });
    cy.intercept('GET', `http://cypressapi/cards/${greetingCard.id}?`, {
      data: greetingCard,
    });

    goToBoard();

    cy.get(`[data-testid=card-${greetingCard.id}`).click();
    cy.get('[aria-label="Edit Elements"]').click();

    cy.step('DELETE BUTTON', () => {
      cy.get(`[aria-label="Edit ${buttonName} button"]`).click();

      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetingField],
      });
      cy.intercept('DELETE', `http://cypressapi/elements/${greetButton.id}`, {
        success: true,
      }).as('deleteButton');
      cy.contains('Delete Button').click();
      cy.wait('@deleteButton');
    });

    cy.step('CONFIRM BUTTON REMOVED FROM EDIT LIST', () => {
      cy.contains(buttonName).should('not.exist');
    });

    cy.step('CONFIRM BUTTON REMOVED FROM CARD', () => {
      cy.get('[aria-label="Done Editing Elements"]').click();
      cy.contains(buttonName).should('not.exist');
    });
  });

  it('allows adding days to a date', () => {
    const newButton = Factory.button({});
    const buttonName = 'Defer 2 Days';
    const deferButton = Factory.button(
      {
        name: buttonName,
        options: {
          actions: [
            {
              command: COMMANDS.ADD_DAYS.key,
              field: greetedAtField.id,
              value: '2', // TODO: consider storing as number
            },
          ],
        },
      },
      newButton,
    );

    // far future because Add Days prefers current date when it's later
    const card = Factory.card({[greetedAtField.id]: '2999-01-01'});

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetedAtField],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.step('CREATE BUTTON', () => {
      cy.get(`[data-testid=card-${card.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newButton,
      }).as('addButton');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetedAtField, newButton],
      });

      cy.contains('Add Element').paperSelect('Button');

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
    });

    cy.step('CONFIGURE BUTTON', () => {
      cy.get('[data-testid="text-input-element-name"]').type(buttonName);

      cy.contains('Add Action').click();
      cy.contains('Command: (choose)').paperSelect('Add Days');
      cy.contains('Action Field: (choose)').paperSelect('Greeted At');
      cy.get('[data-testid=number-input-value]').type(2);

      cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetedAtField, deferButton],
      });
      cy.contains('Save Button').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: deferButton});
      cy.contains(buttonName);
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('RUN BUTTON ACTION', () => {
      const deferredCard = Factory.card(
        {[greetedAtField.id]: '2999-01-03'},
        card,
      );
      cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [deferredCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${deferredCard.id}?`, {
        data: deferredCard,
      });
      cy.contains(buttonName).click();
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {data: deferredCard});
    });

    cy.step('CONFIRM FIELD DATA UPDATED ON CARD', () => {
      cy.contains('Thu Jan 3, 2999');
    });
  });

  it('allows creating button menus', () => {
    const completedAtFieldName = 'Completed At';
    const completedAtField = Factory.field({
      name: completedAtFieldName,
      'data-type': FIELD_DATA_TYPES.DATE.key,
      'show-in-summary': true,
    });
    const card = Factory.card({
      [completedAtField.id]: '2023-01-01',
    });

    const newButtonMenu = Factory.buttonMenu({});
    const menuName = 'Update Status';
    const completeItemName = 'Complete';
    const uncompleteItemName = 'Uncomplete';
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [completedAtField],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    goToBoard();

    cy.step('CREATE BUTTON MENU', () => {
      cy.get(`[data-testid=card-${card.id}]`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newButtonMenu,
      }).as('addButtonMenu');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [completedAtField, newButtonMenu],
      });

      cy.contains('Add Element').paperSelect('Button Menu');

      cy.wait('@addButtonMenu')
        .its('request.body')
        .should('deep.equal', {
          data: {
            type: 'elements',
            relationships: {
              board: {data: {type: 'boards', id: String(board.id)}},
            },
            attributes: {'element-type': ELEMENT_TYPES.BUTTON_MENU.key},
          },
        });
    });

    cy.step('CONFIGURE MENU NAME', () => {
      cy.get('[data-testid="text-input-element-name"]').type(menuName);
    });

    cy.step('ADD A MENU ITEM', () => {
      cy.contains('Add Menu Item').click();
      cy.get('[data-testid="text-input-menu-item-0-name"]').type(
        completeItemName,
      );

      cy.get('[data-testid=menu-item-0]').contains('Add Action').click();
      cy.contains('Command: (choose)').paperSelect('Set Value');
      cy.contains('Action Field: (choose)').paperSelect(completedAtFieldName);
      cy.contains('Value: (choose)').paperSelect(VALUES.NOW.label);
    });

    cy.step('ADD A SECOND MENU ITEM', () => {
      cy.contains('Add Menu Item').click();
      cy.get('[data-testid="text-input-menu-item-1-name"]').type(
        uncompleteItemName,
      );

      cy.get('[data-testid=menu-item-1]').contains('Add Action').click();
      cy.contains('Command: (choose)').paperSelect('Set Value');
      cy.contains('Action Field: (choose)').paperSelect(completedAtFieldName);
      cy.contains('Value: (choose)').paperSelect(VALUES.EMPTY.label);
    });

    cy.step('SAVE MENU', () => {
      const updatedMenu = Factory.buttonMenu(
        {
          name: menuName,
          options: {
            items: [
              {
                name: completeItemName,
                actions: [
                  {
                    command: COMMANDS.SET_VALUE.key,
                    field: completedAtField.id,
                    value: VALUES.NOW.key,
                  },
                ],
              },
              {
                name: uncompleteItemName,
                actions: [
                  {
                    command: COMMANDS.SET_VALUE.key,
                    field: completedAtField.id,
                    value: VALUES.EMPTY.key,
                  },
                ],
              },
            ],
          },
        },
        newButtonMenu,
      );

      cy.intercept('PATCH', `http://cypressapi/elements/${newButtonMenu.id}?`, {
        success: true,
      }).as('updateMenu');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [completedAtField, updatedMenu],
      });
      cy.contains('Save Button').click();
      cy.wait('@updateMenu')
        .its('request.body')
        .should('deep.equal', {data: updatedMenu});
      cy.contains('Save Button').should('not.exist');
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('CONFIRM BUTTON WORKS', () => {
      const uncompletedCard = Factory.card({[completedAtField.id]: null}, card);
      cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [uncompletedCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
        data: uncompletedCard,
      });
      cy.contains(menuName).paperSelect(uncompleteItemName);
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {data: uncompletedCard});

      // wait to go back to card list
      cy.contains(menuName).should('not.exist');

      // wait for card list to reload
      cy.contains('Sun Jan 1, 2023').should('not.exist');

      cy.get(`[data-testid=card-${card.id}]`).click();
      cy.get(`[data-testid="date-input-${completedAtField.id}"]`)
        .invoke('val')
        .should('eq', '');
    });
  });
});
