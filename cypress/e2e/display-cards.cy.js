describe('empty spec', () => {
  it('passes', () => {
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

    cy.intercept('https://localhost:3000/fields', {
      data: [
        {
          id: '1',
          attributes: {name: 'title'},
        },
        {
          id: '2',
          attributes: {name: 'publisher'},
        },
      ],
    });
    cy.intercept('https://localhost:3000/cards', {
      data: cards,
    });

    cy.visit('/');

    cy.contains(cards[0].attributes['field-values'].title);
    cy.contains(cards[0].attributes['field-values'].publisher);
    cy.contains(cards[1].attributes['field-values'].title);
    cy.contains(cards[1].attributes['field-values'].publisher);
  });
});
