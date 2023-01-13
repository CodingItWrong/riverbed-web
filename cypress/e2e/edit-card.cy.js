describe('edit cards', () => {
  it('allows editing cards', () => {
    const card = {
      id: '1',
      attributes: {
        'field-values': {
          Title: 'Final Fantasy 7',
          Publisher: 'Square Enix',
        },
      },
    };
    cy.intercept('GET', 'http://localhost:3000/fields', {
      data: [
        {
          id: '1',
          attributes: {name: 'Title', 'show-in-summary': true},
        },
        {
          id: '2',
          attributes: {name: 'Publisher', 'show-in-summary': false},
        },
      ],
    });
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [card],
    });
    cy.intercept('POST', 'http://localhost:3000/cards', {
      data: {type: 'cards', id: '3', attributes: {'field-values': {}}},
    });

    cy.intercept('PATCH', 'http://localhost:3000/cards/1', {success: true}).as(
      'updateCard1',
    );
    cy.intercept('PATCH', 'http://localhost:3000/cards/3', {success: true});
    cy.intercept('DELETE', 'http://localhost:3000/cards/1', {success: true}).as(
      'deleteCard1',
    );

    cy.visit('/');

    cy.log('SHOW DETAIL');
    cy.contains(card.attributes['field-values'].Title).click();
    cy.get(`[value="${card.attributes['field-values'].Publisher}"]`);

    cy.log('HIDE DETAIL');
    cy.contains('Close').click();
    cy.contains(card.attributes['field-values'].Publisher).should('not.exist');

    cy.log('EDIT CARD');
    const updatedTitle = 'Chrono Trigger';
    const updatedCard = {
      id: '1',
      attributes: {
        'field-values': {
          Title: updatedTitle,
          Publisher: 'Square Enix',
        },
      },
    };
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [updatedCard],
    });

    cy.contains(card.attributes['field-values'].Title).click();
    cy.get('[data-testid=text-input-Title]').clear().type(updatedTitle);
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'cards',
          id: '1',
          attributes: {
            'field-values': {Title: updatedTitle, Publisher: 'Square Enix'},
          },
        },
      });

    cy.contains(card.attributes['field-values'].Title).should('not.exist');
    cy.contains(card.attributes['field-values'].Publisher).should('not.exist');
    cy.contains(updatedTitle);

    cy.log('DELETE CARD');
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [],
    });

    cy.contains(updatedTitle).click();
    cy.contains('Delete').click();
    cy.wait('@deleteCard1');
    cy.contains(updatedTitle).should('not.exist');

    cy.log('CREATE CARD');
    const newCard = {
      id: '3',
      attributes: {
        'field-values': {},
      },
    };
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [newCard],
    });
    const newTitle = 'Earthbound';
    cy.contains('Add Card').click();
    cy.get('[data-testid=text-input-Title]').clear().type(newTitle);
    const updatedNewCard = {
      id: '3',
      attributes: {
        'field-values': {
          Title: 'Earthbound',
        },
      },
    };
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [updatedNewCard],
    });

    cy.contains('Save').click();
    cy.contains(newTitle);
  });
});
