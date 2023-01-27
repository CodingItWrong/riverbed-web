import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import SORT_DIRECTIONS from '../../src/enums/sortDirections';
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

    const firstCardTitle = 'Danganronpoa';
    const secondCardTitle = 'Final Fantasy 7';

    const firstCard = Factory.card({[titleField.id]: firstCardTitle});
    const secondCard = Factory.card({[titleField.id]: secondCardTitle});
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
      data: [firstCard, secondCard],
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
    cy.wait('@addColumn')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'columns',
          relationships: {
            board: {data: {type: 'boards', id: String(board.id)}},
          },
          attributes: {},
        },
      });

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

    cy.contains('Save Column').should('not.exist');
    cy.contains(columnName);

    // should show all cards
    assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
      firstCardTitle,
      secondCardTitle,
    ]);

    cy.log('EDIT COLUMN - SORT');

    cy.get('[aria-label="Edit Column"]').click();

    // TODO: remove qualifier
    cy.contains('Sort Field: (choose)').paperSelect('By Title');
    cy.contains('Sort Direction: (choose)').paperSelect('Descending');

    const updatedColumn = Factory.column(
      {
        'card-sort-order': {
          field: titleField.id,
          direction: SORT_DIRECTIONS.DESCENDING.key,
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
    assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
      secondCardTitle,
      firstCardTitle,
    ]);
    cy.log('EDIT COLUMN - FILTER');

    cy.get('[aria-label="Edit Column"]').click();

    cy.contains('Query: (choose)').paperSelect('Empty');
    cy.contains('Query Field: (choose)').paperSelect('Title');

    const updatedColumn2 = Factory.column(
      {
        'card-inclusion-condition': {
          query: QUERIES.IS_EMPTY.key,
          field: titleField.id,
        },
        'card-sort-order': {
          field: titleField.id,
          direction: SORT_DIRECTIONS.DESCENDING.key,
        },
      },
      allColumn,
    );
    cy.intercept('PATCH', `http://cypressapi/columns/${newColumn.id}?`, {
      success: true,
    }).as('updateColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [updatedColumn2],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: updatedColumn2});

    cy.contains('Save Column').should('not.exist'); // wait for save to complete
    cy.contains(firstCardTitle).should('not.exist');
    cy.contains(secondCardTitle).should('not.exist');

    cy.log('DELETE COLUMN');

    cy.intercept('DELETE', `http://cypressapi/columns/${newColumn.id}`, {
      success: true,
    }).as('deleteColumn');
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [],
    });
    cy.get('[aria-label="Edit Column"]').click();
    cy.contains('Delete Column').click();
    cy.wait('@deleteColumn');

    cy.contains('Delete Column').should('not.exist');
    cy.get('[aria-label="Edit Column"]').should('not.exist');
  });

  function assertContentsOrder(selector, values) {
    values.forEach((value, i) => {
      cy.get(selector).eq(i).contains(value);
    });
  }
});
