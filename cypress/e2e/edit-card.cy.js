describe('edit cards', () => {
  it('allows editing cards', () => {
    const cards = [
      {
        id: '1',
        attributes: {
          'field-values': {
            Title: 'Final Fantasy 7',
            Publisher: 'Square Enix',
          },
        },
      },
      {
        id: '2',
        attributes: {
          'field-values': {
            Title: 'Castlevania: Symphony of the Night',
            Publisher: 'Konami',
          },
        },
      },
    ];
    const cardsAfterUpdate = [
      {
        id: '1',
        attributes: {
          'field-values': {
            Title: 'Chrono Trigger',
            Publisher: 'Square Enix',
          },
        },
      },
      {
        id: '2',
        attributes: {
          'field-values': {
            Title: 'Castlevania: Symphony of the Night',
            Publisher: 'Konami',
          },
        },
      },
    ];
    const cardsAfterDelete = [
      {
        id: '1',
        attributes: {
          'field-values': {
            Title: 'Chrono Trigger',
            Publisher: 'Square Enix',
          },
        },
      },
    ];

    cy.intercept('http://localhost:3000/fields', {
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
    cy.intercept('http://localhost:3000/cards', {
      data: cards,
    });
    cy.intercept('PATCH', 'http://localhost:3000/cards/1', {success: true}).as(
      'updateCard1',
    );
    cy.intercept('DELETE', 'http://localhost:3000/cards/2', {success: true}).as(
      'deleteCard2',
    );

    cy.visit('/');

    // show detail
    cy.contains(cards[0].attributes['field-values'].Title).click();
    cy.get(`[value="${cards[0].attributes['field-values'].Publisher}"]`);

    // hide detail
    cy.contains('Cancel').click();
    cy.contains(cards[0].attributes['field-values'].Publisher).should(
      'not.exist',
    );

    // edit card
    cy.intercept('http://localhost:3000/cards', {
      data: cardsAfterUpdate,
    });

    const newTitle = 'Chrono Trigger';
    cy.contains(cards[0].attributes['field-values'].Title).click();
    cy.get('[data-testid=text-input-Title]').clear().type(newTitle);
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'cards',
          id: '1',
          attributes: {
            'field-values': {Title: 'Chrono Trigger', Publisher: 'Square Enix'},
          },
        },
      });

    cy.contains(cards[0].attributes['field-values'].Title).should('not.exist');
    cy.contains(cards[0].attributes['field-values'].Publisher).should(
      'not.exist',
    );
    cy.contains(newTitle);

    // delete card
    cy.intercept('http://localhost:3000/cards', {
      data: cardsAfterDelete,
    });

    cy.contains(cards[1].attributes['field-values'].Title).click();
    cy.contains('Delete').click();
    cy.wait('@deleteCard2');
    cy.contains('Delete').should('not.exist');
    cy.contains(cards[1].attributes['field-values'].Title).should('not.exist');
  });
});
