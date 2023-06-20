import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import SORT_DIRECTIONS from '../../src/enums/sortDirections';
import SUMMARY_FUNCTIONS from '../../src/enums/summaryFunctions';
import Factory from '../support/Factory';

describe('edit columns', () => {
  const apiUrl = 'http://cypressapi';
  const successJson = {success: true}; // needed to prevent parse errors
  const boardName = 'Video Games';
  const board = Factory.board({name: boardName});

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
  const price = Factory.field({
    name: 'Price',
    'data-type': FIELD_DATA_TYPES.NUMBER.key,
    'show-in-summary': true,
  });

  const unownedTitle = 'Unowned Game';
  const unplayedTitle1 = 'Unplayed Game 1';
  const unplayedTitle2 = 'Unplayed Game 2';
  const playedTitle = 'Played Game 1';

  const unownedCard = Factory.card({
    [titleField.id]: unownedTitle,
    [purchaseDate.id]: null,
    [completeDate.id]: null,
    // [price.id]: null, // undefined to test for NaN
  });
  const unplayedCard1 = Factory.card({
    [titleField.id]: unplayedTitle1,
    [purchaseDate.id]: '2023-01-01',
    [completeDate.id]: null,
    [price.id]: '24.99',
  });
  const unplayedCard2 = Factory.card({
    [titleField.id]: unplayedTitle2,
    [purchaseDate.id]: '1998-01-01',
    [completeDate.id]: null,
    [price.id]: '4.99',
  });
  const playedCard = Factory.card({
    [titleField.id]: playedTitle,
    [purchaseDate.id]: '1998-01-01',
    [completeDate.id]: '1999-01-01',
    [price.id]: '149.99',
  });
  const columnName = 'All';
  const allColumn = Factory.column({name: columnName});

  function setUpInitialData({column = true} = {}) {
    cy.intercept('GET', `${apiUrl}/boards?`, {
      data: [board],
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/elements?`, {
      data: [titleField, purchaseDate, completeDate, price],
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/cards?`, {
      data: [unownedCard, unplayedCard1, unplayedCard2, playedCard],
    });

    if (column) {
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [allColumn],
      });
      cy.intercept('GET', `${apiUrl}/columns/${allColumn.id}?`, {
        data: allColumn,
      });
    }
  }

  function goToBoard() {
    cy.signIn();
    cy.contains(boardName).click();
  }

  it('allows creating columns', () => {
    const newColumn = Factory.column({});
    const editedColumnName = 'My Column';
    const editedColumn = Factory.column({name: editedColumnName}, newColumn);

    setUpInitialData({column: false});
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [],
    });

    goToBoard();

    cy.step('ADD COLUMN', () => {
      cy.intercept('POST', `${apiUrl}/columns?`, {
        data: newColumn,
      }).as('addColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [newColumn],
      });
      cy.intercept('GET', `${apiUrl}/columns/${newColumn.id}?`, {
        data: newColumn,
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
    });

    cy.step('SET COLUMN NAME', () => {
      cy.get('[data-testid="text-input-column-name"]').type(editedColumnName);

      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${newColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [editedColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: editedColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM COLUMN NAME SHOWS', () => {
      cy.contains(editedColumnName).should('exist');
    });
  });

  it('allows editing column sort', () => {
    setUpInitialData();

    goToBoard();

    cy.step('CONFIRM DEFAULT SORT ORDER', () => {
      cy.assertOrder(`[data-testid=field-${titleField.id}]`, [
        e => e.contains(unownedTitle),
        e => e.contains(unplayedTitle1),
        e => e.contains(unplayedTitle2),
        e => e.contains(playedTitle),
      ]);
    });

    cy.step('SET SORT', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Title').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('descending').click();

      const sortedColumn = Factory.column(
        {
          'card-sort-order': {
            field: titleField.id,
            direction: SORT_DIRECTIONS.DESCENDING.key,
          },
        },
        allColumn,
      );
      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${allColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [sortedColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: sortedColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM NEW SORT ORDER', () => {
      cy.assertOrder(`[data-testid=field-${titleField.id}]`, [
        e => e.contains(unplayedTitle2),
        e => e.contains(unplayedTitle1),
        e => e.contains(unownedTitle),
        e => e.contains(playedTitle),
      ]);
    });
  });

  it('allows editing column filtering', () => {
    setUpInitialData();

    goToBoard();

    cy.step('SET COLUMN FILTER', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.get('[data-testid="text-input-column-name"]').clear().type('To Play');

      cy.contains('Add Condition').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Purchase Date').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(QUERIES.IS_NOT_EMPTY.label).click();

      cy.contains('Add Condition').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Complete Date').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(QUERIES.IS_EMPTY.label).click();

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
        },
        allColumn,
      );
      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${allColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [filteredColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: filteredColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM CORRECT CARDS FILTERED OUT', () => {
      cy.contains(unownedTitle).should('not.exist');
      cy.contains(unplayedTitle1).should('exist');
      cy.contains(unplayedTitle2).should('exist');
      cy.contains(playedTitle).should('not.exist');
    });
  });

  it('allows filtering a column by a specific value', () => {
    setUpInitialData();

    goToBoard();

    cy.step('SET COLUMN FILTER', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.get('[data-testid="text-input-column-name"]').clear().type('To Play');

      cy.contains('Add Condition').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Title').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains(QUERIES.EQUALS_VALUE.label).click();
      cy.get(`[data-testid="text-input-${titleField.id}`).type(unownedTitle);

      const filteredColumn = Factory.column(
        {
          name: 'To Play',
          'card-inclusion-conditions': [
            {
              query: QUERIES.EQUALS_VALUE.key,
              field: titleField.id,
              options: {value: unownedTitle},
            },
          ],
        },
        allColumn,
      );
      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${allColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [filteredColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: filteredColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM CORRECT CARDS FILTERED OUT', () => {
      cy.contains(unownedTitle).should('exist');
      cy.contains(unplayedTitle1).should('not.exist');
      cy.contains(unplayedTitle2).should('not.exist');
      cy.contains(playedTitle).should('not.exist');
    });
  });

  it('allows editing column card grouping', () => {
    setUpInitialData();

    goToBoard();

    cy.step('SET GROUPING', () => {
      cy.get('[aria-label="Edit Column"]').click();

      // sort order
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Title').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('ascending').click();

      // grouping
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('Purchase Date').click();
      cy.contains('(choose)').click();
      cy.get('[role=listbox]').contains('descending').click();

      const groupedColumn = Factory.column(
        {
          'card-grouping': {
            field: purchaseDate.id,
            direction: 'DESCENDING',
          },
          'card-sort-order': {
            field: titleField.id,
            direction: 'ASCENDING',
          },
        },
        allColumn,
      );
      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${allColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [groupedColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: groupedColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM GROUPING', () => {
      // confirm which groups are shown in which order
      cy.assertOrder('[data-testid=group-heading]', [
        e => e.contains('(empty)'),
        e => e.contains('Sun Jan 1, 2023'),
        e => e.contains('Thu Jan 1, 1998'),
      ]);

      // confirm the cards in each group
      cy.assertOrder(
        `[data-testid="group-${purchaseDate.id}-2023-01-01-card"]`,
        [e => e.contains(unplayedTitle1)],
      );
      cy.assertOrder(
        `[data-testid="group-${purchaseDate.id}-1998-01-01-card"]`,
        [e => e.contains(playedTitle), e => e.contains(unplayedTitle2)],
      );
      cy.assertOrder(`[data-testid="group-${purchaseDate.id}-null-card"]`, [
        e => e.contains(unownedTitle),
      ]);
    });
  });

  it('allows editing column summary', () => {
    setUpInitialData();

    goToBoard();

    cy.step('EDIT COLUMN SUMMARY', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.contains('Summary').parent().contains('(choose)').click();
      cy.get('[role=listbox]').contains('Sum').click();
      cy.contains('Summary').parent().contains('(choose)').click();
      cy.get('[role=listbox]').contains('Price').click();

      const summedColumn = Factory.column(
        {
          summary: {
            function: SUMMARY_FUNCTIONS.SUM.key,
            options: {
              field: price.id,
            },
          },
        },
        allColumn,
      );
      cy.intercept(
        'PATCH',
        `${apiUrl}/columns/${allColumn.id}?`,
        successJson,
      ).as('updateColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [summedColumn],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumn')
        .its('request.body')
        .should('deep.equal', {data: summedColumn});
      cy.contains('Save Column').should('not.exist');
    });

    cy.step('CONFIRM SUMMARY', () => {
      cy.contains('All (179.97)');
    });
  });

  it('allows ordering columns', () => {
    setUpInitialData({column: false});

    const columnA = Factory.column({name: 'Column A', displayOrder: 1});
    const columnB = Factory.column({name: 'Column B', displayOrder: 2});
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
      data: [columnA, columnB],
    });
    cy.intercept('GET', `${apiUrl}/columns/${columnA.id}?`, {
      data: columnA,
    });
    cy.intercept('GET', `${apiUrl}/columns/${columnB.id}?`, {
      data: columnB,
    });

    goToBoard();

    cy.step('CONFIRM INITIAL ORDER', () => {
      cy.assertOrder('[data-testid="column-name"]', [
        e => e.contains('Column A'),
        e => e.contains('Column B'),
      ]);
    });

    const updatedColumnA = Factory.column(
      {
        'display-order': 2,
      },
      columnA,
    );
    cy.step('SET COLUMN A TO BE SECOND', () => {
      cy.get('[aria-label="Edit Column"]').eq(0).click();
      cy.get('[data-testid=number-input-order]').type(2);

      cy.intercept('PATCH', `${apiUrl}/columns/${columnA.id}?`, successJson).as(
        'updateColumnA',
      );
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [updatedColumnA, columnB],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumnA')
        .its('request.body')
        .should('deep.equal', {data: updatedColumnA});
    });

    const updatedColumnB = Factory.column(
      {
        'display-order': 1,
      },
      columnB,
    );
    cy.step('SET COLUMN B TO BE FIRST', () => {
      cy.get('[aria-label="Edit Column"]').eq(1).click();
      cy.get('[data-testid=number-input-order]').type(1);

      cy.intercept('PATCH', `${apiUrl}/columns/${columnB.id}?`, successJson).as(
        'updateColumnB',
      );
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [updatedColumnA, updatedColumnB],
      });
      cy.contains('Save Column').click();
      cy.wait('@updateColumnB')
        .its('request.body')
        .should('deep.equal', {data: updatedColumnB});
    });

    cy.step('CONFIRM UPDATED ORDER', () => {
      cy.assertOrder('[data-testid="column-name"]', [
        e => e.contains('Column B'),
        e => e.contains('Column A'),
      ]);
    });
  });

  it('allows deleting columns', () => {
    setUpInitialData();

    goToBoard();

    cy.step('PERFORM THE DELETE', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.intercept(
        'DELETE',
        `${apiUrl}/columns/${allColumn.id}`,
        successJson,
      ).as('deleteColumn');
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [],
      });
      cy.contains('Delete Column').click();
      cy.wait('@deleteColumn');
      cy.contains('Delete Column').should('not.exist');
    });

    cy.step('CONFIRM COLUMN IS GONE', () => {
      cy.contains(columnName).should('not.exist');
    });
  });
});
