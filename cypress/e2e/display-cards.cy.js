describe('display cards', () => {
  it('displays cards from the server', () => {
    const cards = [
      {
        id: '1',
        attributes: {
          'field-values': {
            title: 'Final Fantasy 7',
            publisher: 'Square Enix',
          },
        },
      },
      {
        id: '2',
        attributes: {
          'field-values': {
            title: 'Castlevania: Symphony of the Night',
            publisher: 'Konami',
          },
        },
      },
    ];

    cy.intercept('http://localhost:3000/fields', {
      data: [
        {
          id: '1',
          attributes: {name: 'title', 'show-in-summary': true},
        },
        {
          id: '2',
          attributes: {name: 'publisher', 'show-in-summary': false},
        },
      ],
    });
    cy.intercept('http://localhost:3000/cards', {
      data: cards,
    });

    cy.visit('/');

    cy.contains(cards[0].attributes['field-values'].title);
    cy.contains(cards[1].attributes['field-values'].title);
    cy.contains(cards[0].attributes['field-values'].publisher).should(
      'not.exist',
    );
  });
});
