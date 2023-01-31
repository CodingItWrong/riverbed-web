import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import SORT_DIRECTIONS from '../../src/enums/sortDirections';
import Factory from '../support/Factory';

describe('edit columns', () => {
  const apiUrl = 'http://cypressapi';
  const successJson = {success: true}; // needed to prevent parse errors
  const board = Factory.board({name: 'Video Games'});

  const titleField = Factory.field({
    name: 'Title',
    'data-type': FIELD_DATA_TYPES.TEXT.key,
    'show-in-summary': true,
  });
  const purchaseDate = Factory.field({
    name: 'Purchase Date',
    'data-type': FIELD_DATA_TYPES.DATE.key,
    'show-in-summary': false,
  });
  const completeDate = Factory.field({
    name: 'Complete Date',
    'data-type': FIELD_DATA_TYPES.DATE.key,
    'show-in-summary': false,
  });

  const unownedTitle = 'Unowned Game';
  const unplayedTitle = 'Unplayed Game';
  const playedTitle = 'Played Game';

  const unownedCard = Factory.card({
    [titleField.id]: unownedTitle,
    [purchaseDate.id]: null,
    [completeDate.id]: null,
  });
  const unplayedCard = Factory.card({
    [titleField.id]: unplayedTitle,
    [purchaseDate.id]: '2023-01-01',
    [completeDate.id]: null,
  });
  const playedCard = Factory.card({
    [titleField.id]: playedTitle,
    [purchaseDate.id]: '1998-01-01',
    [completeDate.id]: '1999-01-01',
  });
  const newColumn = Factory.column({});
  const columnName = 'All';
  const allColumn = Factory.column({name: columnName}, newColumn);

  it('allows creating, editing, and deleting columns', () => {
    cy.intercept('GET', `${apiUrl}/boards?`, {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/elements?`, {
      data: [titleField, purchaseDate, completeDate],
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [],
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/cards?`, {
      data: [unownedCard, unplayedCard, playedCard],
    });

    // go to Video Games board
    cy.visit('/');
    cy.contains('Video Games').click();

    createColumn();
    editColumnSort();
    editColumnFilter();
    deleteColumn();
  });

  function createColumn() {
    cy.log('CREATE COLUMN');

    // add column
    cy.intercept('POST', `${apiUrl}/columns?`, {
      data: newColumn,
    }).as('addColumn');
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [newColumn],
    });

    cy.get('[aria-label="Add Column"]').click();
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

    // set column name
    cy.get('[data-testid="text-input-column-name"]').type(columnName);

    cy.intercept('PATCH', `${apiUrl}/columns/${newColumn.id}?`, successJson).as(
      'updateColumn',
    );
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [allColumn],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: allColumn});

    cy.contains('Save Column').should('not.exist');

    // confirm column name shows
    cy.contains(columnName).should('exist');
  }

  function editColumnSort() {
    cy.log('EDIT COLUMN - SORT');

    // confirm default sort order
    cy.assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
      unownedTitle,
      unplayedTitle,
      playedTitle,
    ]);

    // set sort
    cy.get('[aria-label="Edit Column"]').click();

    cy.contains('Sort Field: (choose)').paperSelect('Title');
    cy.contains('Sort Direction: (choose)').paperSelect('Descending');

    const sortedColumn = Factory.column(
      {
        'card-sort-order': {
          field: titleField.id,
          direction: SORT_DIRECTIONS.DESCENDING.key,
        },
      },
      allColumn,
    );
    cy.intercept('PATCH', `${apiUrl}/columns/${newColumn.id}?`, successJson).as(
      'updateColumn',
    );
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [sortedColumn],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: sortedColumn});
    cy.contains('Save Column').should('not.exist');

    // confirm sort order has reversed
    cy.assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
      unplayedTitle,
      unownedTitle,
      playedTitle,
    ]);
  }

  function editColumnFilter() {
    cy.log('EDIT COLUMN - FILTER');

    // set filter
    cy.get('[aria-label="Edit Column"]').click();

    cy.get('[data-testid="text-input-column-name"]').clear().type('To Play');

    cy.contains('Add Filter').click();
    cy.contains('Show Query: (choose)').paperSelect('Not Empty');
    cy.contains('Query Field: (choose)').paperSelect('Purchase Date');

    cy.contains('Add Filter').click();
    cy.contains('Show Query: (choose)').paperSelect('Empty');
    cy.contains('Query Field: (choose)').paperSelect('Complete Date');

    const filteredColumn = Factory.column(
      {
        name: 'To Play',
        'card-inclusion-conditions': [
          {
            query: QUERIES.IS_NOT_EMPTY.key,
            field: purchaseDate.id,
          },
          {
            query: QUERIES.IS_EMPTY.key,
            field: completeDate.id,
          },
        ],
        'card-sort-order': {
          field: titleField.id,
          direction: SORT_DIRECTIONS.DESCENDING.key,
        },
      },
      allColumn,
    );
    cy.intercept('PATCH', `${apiUrl}/columns/${newColumn.id}?`, successJson).as(
      'updateColumn',
    );
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [filteredColumn],
    });
    cy.contains('Save Column').click();
    cy.wait('@updateColumn')
      .its('request.body')
      .should('deep.equal', {data: filteredColumn});
    cy.contains('Save Column').should('not.exist');

    // confirm correct cards filtered out
    cy.contains(unownedTitle).should('not.exist');
    cy.contains(unplayedTitle).should('exist');
    cy.contains(playedTitle).should('not.exist');
  }

  function deleteColumn() {
    cy.log('DELETE COLUMN');

    cy.get('[aria-label="Edit Column"]').click();

    // perform the delete
    cy.intercept('DELETE', `${apiUrl}/columns/${newColumn.id}`, successJson).as(
      'deleteColumn',
    );
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [],
    });
    cy.contains('Delete Column').click();
    cy.wait('@deleteColumn');
    cy.contains('Delete Column').should('not.exist');

    // confirm the column is gone
    cy.contains(columnName).should('not.exist');
  }
});
