import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import Factory from '../support/Factory';

describe('edit columns', () => {
  it('allows creating, editing, and deleting columns', () => {
    const board = Factory.board({
      name: 'Video Games',
    });

    const titleField = Factory.field({
      name: 'Title',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });
    const cardTitle = 'Final Fantasy 7';
    const card = Factory.card({
      [titleField.id]: cardTitle,
    });
    const newColumn = Factory.column({});

    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: [titleField],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });

    cy.visit('/');
    cy.contains('Video Games').click();

    cy.log('CREATE COLUMN');

    cy.intercept('POST', 'http://cypressapi/columns?', {
      data: newColumn,
    }).as('addColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [newColumn],
    });

    cy.contains('Add Column').click();
    cy.wait('@addColumn');

    const columnName = 'All';
    cy.get('[data-testid="text-input-column-name"]').type(columnName);

    const allColumn = Factory.column({name: columnName}, newColumn);
    cy.intercept('PATCH', `http://cypressapi/columns/${newColumn.id}?`, {
      success: true,
    }).as('updateColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [allColumn],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: allColumn});

    cy.contains(columnName);

    // should show all cards
    cy.contains(cardTitle);

    cy.log('EDIT COLUMN');

    cy.contains('Edit Column').click();

    cy.contains('Query: (choose)').paperSelect('Empty');
    cy.contains('Field: (choose)').paperSelect('Title');

    const updatedColumn = Factory.column(
      {
        'card-inclusion-condition': {
          query: QUERIES.IS_EMPTY.key,
          field: titleField.id,
        },
      },
      allColumn,
    );
    cy.intercept('PATCH', `http://cypressapi/columns/${newColumn.id}?`, {
      success: true,
    }).as('updateColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [updatedColumn],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: updatedColumn});

    cy.contains('Save Column').should('not.exist'); // wait for save to complete
    cy.contains(cardTitle).should('not.exist');

    cy.log('DELETE COLUMN');

    cy.intercept('DELETE', `http://cypressapi/columns/${newColumn.id}`, {
      success: true,
    }).as('deleteColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [],
    });
    cy.contains('Edit Column').click();
    cy.contains('Delete Column').click();
    cy.wait('@deleteColumn');

    cy.contains('Delete Column').should('not.exist');
    cy.contains('Edit Column').should('not.exist');
  });
});
