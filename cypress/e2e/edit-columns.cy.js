import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import SORT_DIRECTIONS from '../../src/enums/sortDirections';
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
  const genreField = Factory.field({
    name: 'Genre',
    'data-type': FIELD_DATA_TYPES.TEXT.key,
    'show-in-summary': false,
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
    [genreField.id]: 'Action',
    [purchaseDate.id]: null,
    [completeDate.id]: null,
  });
  const unplayedCard = Factory.card({
    [titleField.id]: unplayedTitle,
    [genreField.id]: 'RPG',
    [purchaseDate.id]: '2023-01-01',
    [completeDate.id]: null,
  });
  const playedCard = Factory.card({
    [titleField.id]: playedTitle,
    [genreField.id]: 'RPG',
    [purchaseDate.id]: '1998-01-01',
    [completeDate.id]: '1999-01-01',
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
      data: [titleField, genreField, purchaseDate, completeDate],
    });
    cy.intercept('GET', `${apiUrl}/boards/${board.id}/cards?`, {
      data: [unownedCard, unplayedCard, playedCard],
    });

    if (column) {
      cy.intercept('GET', `${apiUrl}/boards/${board.id}/columns?`, {
        data: [allColumn],
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
      cy.assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
        unownedTitle,
        unplayedTitle,
        playedTitle,
      ]);
    });

    cy.step('SET SORT', () => {
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
      cy.assertContentsOrder(`[data-testid=field-${titleField.id}]`, [
        unplayedTitle,
        unownedTitle,
        playedTitle,
      ]);
    });
  });

  it('allows editing column filtering', () => {
    setUpInitialData();

    goToBoard();

    cy.step('SET COLUMN FILTER', () => {
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
      cy.contains(unplayedTitle).should('exist');
      cy.contains(playedTitle).should('not.exist');
    });
  });

  it('allows editing column card grouping', () => {
    setUpInitialData();

    goToBoard();

    cy.step('SET GROUPING', () => {
      cy.get('[aria-label="Edit Column"]').click();

      cy.contains('Group Field: (choose)').paperSelect('Genre');
      cy.contains('Group Direction: (choose)').paperSelect('Ascending');

      const groupedColumn = Factory.column(
        {
          'card-grouping': {
            field: genreField.id,
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
      cy.assertContentsOrder('[data-testid=group-heading]', ['Action', 'RPG']);

      // confirm the cards in each group
      cy.assertContentsOrder(
        `[data-testid="group-${genreField.id}-Action-card"]`,
        [unownedTitle],
      );
      cy.assertContentsOrder(
        `[data-testid="group-${genreField.id}-RPG-card"]`,
        [unplayedTitle, playedTitle],
      );

      // TODO: use Paper styles
    });
  });

  it('allows ordering columns', () => {
    setUpInitialData({column: false});

    const columnA = Factory.column({name: 'Column A', displayOrder: 1});
    const columnB = Factory.column({name: 'Column B', displayOrder: 2});
    cy.intercept(`${apiUrl}/boards/${board.id}/columns?`, {
      data: [columnA, columnB],
    });

    goToBoard();

    cy.step('CONFIRM INITIAL ORDER', () => {
      cy.assertContentsOrder('[data-testid="column-name"]', [
        'Column A',
        'Column B',
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
      cy.assertContentsOrder('[data-testid="column-name"]', [
        'Column B',
        'Column A',
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
