import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';
  const publisher = 'Square Enix';
  const updatedTitle = 'Chrono Trigger';
  const newTitle = 'Earthbound';

  it('allows editing cards', () => {
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

    const fields = [titleField, publisherField, releasedAtField];
    const card = Factory.card({
      [titleField.id]: title,
      [publisherField.id]: publisher,
    });
    cy.intercept('GET', 'http://cypressapi/fields?', {
      data: fields,
    });
    cy.intercept('GET', 'http://cypressapi/cards?', {
      data: [card],
    });

    cy.visit('/');

    cy.log('SHOW DETAIL');
    cy.contains(title).click();
    cy.get(`[data-testid="text-input-${publisherField.id}"]`)
      .invoke('val')
      .then(value => expect(value).to.equal(publisher));

    cy.log('HIDE DETAIL');
    cy.contains('Close').click();
    cy.contains(publisher).should('not.exist');

    cy.log('EDIT CARD');
    const updatedCard = Factory.card(
      {[titleField.id]: updatedTitle, [releasedAtField.id]: '2000-01-01'},
      card,
    );
    console.log('PATCHING', card.id);
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard1');
    cy.intercept('GET', 'http://cypressapi/cards?', {data: [updatedCard]});

    cy.contains(card.attributes['field-values'][titleField.id]).click();
    cy.get(`[data-testid=text-input-${titleField.id}]`)
      .clear()
      .type(updatedTitle);
    cy.get(`[data-testid="date-input-${releasedAtField.id}"]`)
      .clear()
      .type('01/01/2000');
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {data: updatedCard});

    cy.contains(card.attributes['field-values'][titleField.id]).should(
      'not.exist',
    );
    cy.contains(card.attributes['field-values'][publisherField.id]).should(
      'not.exist',
    );
    cy.contains(updatedTitle);
    cy.contains('Jan 1, 2000');

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
    const newCard = Factory.card();
    console.log({newCard});
    cy.intercept('POST', 'http://cypressapi/cards?', {data: newCard});
    cy.intercept('GET', 'http://cypressapi/cards?', {data: [newCard]});
    cy.contains('Add Card').click();
    cy.get(`[data-testid=text-input-${titleField.id}]`).clear().type(newTitle);
    const updatedNewCard = Factory.card({[titleField.id]: newTitle}, newCard);
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
