import Factory from '../support/Factory';

describe('display cards', () => {
  it('displays cards from the server', () => {
    const titleField = Factory.field({
      name: 'Title',
      'data-type': 'text',
      'show-in-summary': true,
    });
    const publisherField = Factory.field({
      name: 'Publisher',
      'data-type': 'text',
      'show-in-summary': false,
    });
    const releasedAtField = Factory.field({
      name: 'Released At',
      'data-type': 'date',
      'show-in-summary': true,
    });

    const cards = [
      Factory.card({
        [titleField.id]: 'Final Fantasy 7',
        [publisherField.id]: 'Square Enix',
        [releasedAtField.id]: '1997-01-31',
      }),
      Factory.card({
        [titleField.id]: 'Castlevania: Symphony of the Night',
        [publisherField.id]: 'Konami',
      }),
    ];

    cy.intercept('http://cypressapi/fields?', {
      data: [titleField, publisherField, releasedAtField],
    });
    cy.intercept('http://cypressapi/columns?', {
      data: [{id: '1', attributes: {name: 'All Cards'}}],
    });
    cy.intercept('http://cypressapi/cards?', {
      data: cards,
    });

    cy.visit('/');

    cy.contains(cards[0].attributes['field-values'][titleField.id]);
    cy.contains('Jan 31, 1997');
    cy.contains(cards[1].attributes['field-values'][titleField.id]);
    cy.contains(cards[0].attributes['field-values'][publisherField.id]).should(
      'not.exist',
    );
  });
});
