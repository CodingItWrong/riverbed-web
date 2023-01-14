import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';
  const publisher = 'Square Enix';
  const updatedTitle = 'Chrono Trigger';
  const newTitle = 'Earthbound';

  it('allows editing cards', () => {
    const fields = [
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
        'data-type': 'datetime',
        'show-in-summary': true,
      }),
    ];
    const card = Factory.card({Title: title, Publisher: publisher});
    cy.intercept('GET', 'http://cypressapi/fields?', {
      data: fields,
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [card],
    });

    cy.visit('/');

    cy.log('SHOW DETAIL');
    cy.contains(title).click();
    cy.get('[data-testid="text-input-Publisher"]')
      .invoke('val')
      .then(value => expect(value).to.equal(publisher));

    cy.log('HIDE DETAIL');
    cy.contains('Close').click();
    cy.contains(publisher).should('not.exist');

    cy.log('EDIT CARD');
    const updatedCard = Factory.card(
      {Title: updatedTitle, 'Released At': '2000-01-01T05:00:00.000Z'},
      card,
    );
    console.log('PATCHING', card.id);
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard1');
    cy.intercept('GET', 'http://cypressapi/cards?', {data: [updatedCard]});

    cy.contains(card.attributes['field-values'].Title).click();
    cy.get('[data-testid=text-input-Title]').clear().type(updatedTitle);
    cy.get('[data-testid="datetime-input-Released At"]')
      .clear()
      .type('01/01/2000');
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {data: updatedCard});

    cy.contains(card.attributes['field-values'].Title).should('not.exist');
    cy.contains(card.attributes['field-values'].Publisher).should('not.exist');
    cy.contains(updatedTitle);
    cy.contains('Jan 1, 2000 12:00 am');

    cy.log('DELETE CARD');
    cy.intercept('DELETE', `http://cypressapi/cards/${card.id}`, {
      success: true,
    }).as('deleteCard');
    cy.intercept('GET', 'http://cypressapi/cards?', {data: []});

    cy.contains(updatedTitle).click();
    cy.contains('Delete').click();
    cy.wait('@deleteCard');
    cy.contains(updatedTitle).should('not.exist');

    cy.log('CREATE CARD');
    const newCard = Factory.card({Title: '', Publisher: ''});
    cy.intercept('POST', 'http://cypressapi/cards?', {data: newCard});
    cy.intercept('GET', 'http://cypressapi/cards?', {data: [newCard]});
    cy.contains('Add Card').click();
    cy.get('[data-testid=text-input-Title]').clear().type(newTitle);
    const updatedNewCard = Factory.card({Title: newTitle}, newCard);
    cy.intercept('PATCH', `http://cypressapi/cards/${newCard.id}?`, {
      success: true,
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [updatedNewCard],
    });

    cy.contains('Save').click();
    cy.contains(newTitle);
  });
});
