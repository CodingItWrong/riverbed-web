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
        'show-conditions': [
          {
            query: QUERIES.IS_NOT_EMPTY.key,
            field: greetingField.id,
          },
        ],
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
      cy.intercept('GET', `http://cypressapi/elements/${newButton.id}?`, {
        data: newButton,
      });

      cy.contains('Add Element').click();
      cy.contains('Button').click();

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
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Set Value').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Greeting').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(VALUES.EMPTY.label).click();

      // show condition
      cy.contains('Add Condition').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Greeting').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(QUERIES.IS_NOT_EMPTY.label).click();

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
    cy.intercept('GET', `http://cypressapi/elements/${greetButton.id}?`, {
      data: greetButton,
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
      cy.contains(updatedButtonName);
    });
  });

  it('allows deleting buttons', () => {
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button({name: buttonName});

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, greetButton],
    });
    cy.intercept('GET', `http://cypressapi/elements/${greetButton.id}?`, {
      data: greetButton,
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
      cy.contains('Yes, Delete Button').click();
      cy.wait('@deleteButton');
    });

    cy.step('CONFIRM BUTTON REMOVED FROM EDIT LIST', () => {
      cy.contains(buttonName).should('not.exist');
    });

    cy.step('CONFIRM BUTTON REMOVED FROM CARD', () => {
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
              'specific-value': '2',
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
      cy.intercept('GET', `http://cypressapi/elements/${newButton.id}?`, {
        data: newButton,
      });

      cy.contains('Add Element').click();
      cy.contains('Button').click();

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
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Add Days').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Greeted At').click();
      cy.get('[data-testid=number-input-days-to-add]').type(2);

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

  it('allows setting a specific concrete text value', () => {
    const newButton = Factory.button({});
    const buttonName = 'Change the Greeting';
    const newGreeting = 'Good day!';
    const greetButton = Factory.button(
      {
        name: buttonName,
        options: {
          actions: [
            {
              command: COMMANDS.SET_VALUE.key,
              field: greetingField.id,
              value: VALUES.SPECIFIC_VALUE.key,
              'specific-value': newGreeting,
            },
          ],
        },
      },
      newButton,
    );

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

    cy.step('CREATE BUTTON', () => {
      cy.get(`[data-testid=card-${greetingCard.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();

      cy.intercept('POST', 'http://cypressapi/elements?', {
        data: newButton,
      }).as('addButton');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [greetingField, newButton],
      });
      cy.intercept('GET', `http://cypressapi/elements/${newButton.id}?`, {
        data: newButton,
      });

      cy.contains('Add Element').click();
      cy.contains('Button').click();

      cy.wait('@addButton');
    });

    cy.step('CONFIGURE BUTTON', () => {
      cy.get('[data-testid="text-input-element-name"]').type(buttonName);

      cy.contains('Add Action').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Set Value').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Greeting').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('specific value').click();
      cy.get(`[data-testid=text-input-${greetingField.id}]`)
        .eq(1)
        .type(newGreeting);

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

    cy.step('RUN BUTTON ACTION', () => {
      const updatedCard = Factory.card(
        {[greetingField.id]: newGreeting},
        greetingCard,
      );
      cy.intercept('PATCH', `http://cypressapi/cards/${greetingCard.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [updatedCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${updatedCard.id}?`, {
        data: updatedCard,
      });
      cy.contains(buttonName).click();
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {data: updatedCard});
    });

    cy.step('CONFIRM FIELD DATA UPDATED ON CARD', () => {
      cy.contains(newGreeting);
    });
  });

  it('allows setting a specific concrete choice value', () => {
    const colorField = Factory.field({
      name: 'Color',
      'data-type': FIELD_DATA_TYPES.CHOICE.key,
      'show-in-summary': true,
      options: {
        choices: [
          {id: 'red_uuid', label: 'Red'},
          {id: 'green_uuid', label: 'Green'},
        ],
      },
    });
    const colorCard = Factory.card({[colorField.id]: null});

    const buttonName = 'Go';
    const goButton = Factory.button({
      name: buttonName,
    });
    const updatedGoButton = Factory.button(
      {
        options: {
          actions: [
            {
              command: COMMANDS.SET_VALUE.key,
              field: colorField.id,
              value: VALUES.SPECIFIC_VALUE.key,
              'specific-value': 'green_uuid',
            },
          ],
        },
      },
      goButton,
    );

    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [colorField, goButton],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [colorCard],
    });
    cy.intercept('GET', `http://cypressapi/cards/${colorCard.id}?`, {
      data: colorCard,
    });
    cy.intercept('GET', `http://cypressapi/elements/${goButton.id}?`, {
      data: goButton,
    });

    goToBoard();

    cy.step('CONFIGURE BUTTON', () => {
      cy.get(`[data-testid=card-${colorCard.id}`).click();
      cy.get('[aria-label="Edit Elements"]').click();
      cy.get(`[aria-label="Edit ${buttonName} button"`).click();

      cy.contains('Add Action').click();
      const getActionsContainer = () => cy.contains('Click Actions').parent();
      getActionsContainer().contains('(choose)').click();
      cy.get('[role=listbox]').contains('Set Value').click();
      getActionsContainer().contains('(choose)').click();
      cy.get('[role=listbox]').contains('Color').click();
      getActionsContainer().contains('(choose)').click();
      cy.get('[role=listbox]').contains('specific value').click();
      getActionsContainer().contains('(choose)').click();
      cy.get('[role=listbox]').contains('Green').click();

      cy.intercept('PATCH', `http://cypressapi/elements/${goButton.id}?`, {
        success: true,
      }).as('updateField');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
        data: [colorField, updatedGoButton],
      });
      cy.contains('Save Button').click();
      cy.wait('@updateField')
        .its('request.body')
        .should('deep.equal', {data: updatedGoButton});
      cy.contains(buttonName);
      cy.get('[aria-label="Done Editing Elements"]').click();
    });

    cy.step('RUN BUTTON ACTION', () => {
      const updatedCard = Factory.card(
        {[colorField.id]: 'green_uuid'},
        colorCard,
      );
      cy.intercept('PATCH', `http://cypressapi/cards/${colorCard.id}?`, {
        success: true,
      }).as('updateCard');
      cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
        data: [updatedCard],
      });
      cy.intercept('GET', `http://cypressapi/cards/${updatedCard.id}?`, {
        data: updatedCard,
      });
      cy.contains(buttonName).click();
      cy.wait('@updateCard')
        .its('request.body')
        .should('deep.equal', {data: updatedCard});
    });

    cy.step('CONFIRM FIELD DATA UPDATED ON CARD', () => {
      cy.contains('Green');
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
      cy.intercept('GET', `http://cypressapi/elements/${newButtonMenu.id}?`, {
        data: newButtonMenu,
      });

      cy.contains('Add Element').click();
      cy.contains('Button Menu').click();

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
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Set Value').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(completedAtFieldName).click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(VALUES.NOW.label).click();
    });

    cy.step('ADD A SECOND MENU ITEM', () => {
      cy.contains('Add Menu Item').click();
      cy.get('[data-testid="text-input-menu-item-1-name"]').type(
        uncompleteItemName,
      );

      cy.get('[data-testid=menu-item-1]').contains('Add Action').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Set Value').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(completedAtFieldName).click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(VALUES.EMPTY.label).click();
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
      cy.contains(menuName).click();
      cy.contains(uncompleteItemName).click();
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
        .should('eq', ''); // empty
    });
  });
});
