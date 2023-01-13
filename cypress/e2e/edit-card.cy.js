import Factory from '../support/Factory';

describe('edit cards', () => {
  const title = 'Final Fantasy 7';
  const publisher = 'Square Enix';
  const updatedTitle = 'Chrono Trigger';
  const newTitle = 'Earthbound';

  it('allows editing cards', () => {
    const fields = [
      Factory.field({name: 'Title', 'show-in-summary': true}),
      Factory.field({name: 'Publisher', 'show-in-summary': false}),
    ];
    const card = Factory.card({Title: title, Publisher: publisher});
    cy.intercept('GET', 'http://localhost:3000/fields', {
      data: fields,
    });
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [card],
    });

    cy.visit('/');

    cy.log('SHOW DETAIL');
    cy.contains(title).click();
    cy.get(`[value="${publisher}"]`);

    cy.log('HIDE DETAIL');
    cy.contains('Close').click();
    cy.contains(publisher).should('not.exist');

    cy.log('EDIT CARD');
    const updatedCard = Factory.card({Title: updatedTitle}, card);
    cy.intercept('PATCH', `http://localhost:3000/cards/${card.id}`, {
      success: true,
    }).as('updateCard1');
    cy.intercept('GET', 'http://localhost:3000/cards', {data: [updatedCard]});

    cy.contains(card.attributes['field-values'].Title).click();
    cy.get('[data-testid=text-input-Title]').clear().type(updatedTitle);
    cy.contains('Save').click();

    cy.wait('@updateCard1')
      .its('request.body')
      .should('deep.equal', {data: updatedCard});

    cy.contains(card.attributes['field-values'].Title).should('not.exist');
    cy.contains(card.attributes['field-values'].Publisher).should('not.exist');
    cy.contains(updatedTitle);

    cy.log('DELETE CARD');
    cy.intercept('DELETE', `http://localhost:3000/cards/${card.id}`, {
      success: true,
    }).as('deleteCard');
    cy.intercept('GET', 'http://localhost:3000/cards', {data: []});

    cy.contains(updatedTitle).click();
    cy.contains('Delete').click();
    cy.wait('@deleteCard');
    cy.contains(updatedTitle).should('not.exist');

    cy.log('CREATE CARD');
    const newCard = Factory.card({Title: '', Publisher: ''});
    cy.intercept('POST', 'http://localhost:3000/cards', {data: newCard});
    cy.intercept('GET', 'http://localhost:3000/cards', {data: [newCard]});
    cy.contains('Add Card').click();
    cy.get('[data-testid=text-input-Title]').clear().type(newTitle);
    const updatedNewCard = Factory.card({Title: newTitle}, newCard);
    cy.intercept('PATCH', `http://localhost:3000/cards/${newCard}`, {
      success: true,
    });
    cy.intercept('GET', 'http://localhost:3000/cards', {
      data: [updatedNewCard],
    });

    cy.contains('Save').click();
    cy.contains(newTitle);
  });
});
