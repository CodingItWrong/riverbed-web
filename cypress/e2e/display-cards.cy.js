import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
    const cards = [
      Factory.card({
        Title: 'Final Fantasy 7',
        Publisher: 'Square Enix',
        'Released At': '1997-01-31',
      }),
      Factory.card({
        Title: 'Castlevania: Symphony of the Night',
        Publisher: 'Konami',
      }),
    ];

    cy.intercept('http://cypressapi/fields?', {
      data: [
        Factory.field({
          name: 'Title',
          'data-type': 'text',
          'show-in-summary': true,
        }),
        Factory.field({
          name: 'Publisher',
          'data-type': 'text',
          'show-in-summary': false,
        }),
        Factory.field({
          name: 'Released At',
          'data-type': 'date',
          'show-in-summary': true,
        }),
      ],
    });
    cy.intercept('http://cypressapi/cards?', {
      data: cards,
    });

    cy.visit('/');

    cy.contains(cards[0].attributes['field-values'].Title);
    cy.contains('Jan 31, 1997');
    cy.contains(cards[1].attributes['field-values'].Title);
    cy.contains(cards[0].attributes['field-values'].Publisher).should(
      'not.exist',
    );
  });
});
