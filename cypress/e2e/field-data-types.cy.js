import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import Factory from '../support/Factory';

describe('field data types', () => {
  const boardName = 'Video Games';
  const board = Factory.board({
    name: boardName,
  });

  const sharedAttributes = {
    'show-in-summary': true,
    options: {
      'show-label-when-read-only': true,
    },
  };
  const choiceField = Factory.field({
    name: 'Choice',
    'data-type': FIELD_DATA_TYPES.CHOICE.key,
    ...sharedAttributes,
    options: {
      ...sharedAttributes.options,
      choices: [
        {id: 'fake_uuid_1', label: 'Choice 1'},
        {id: 'fake_uuid_2', label: 'Choice 2'},
      ],
    },
  });
  const dateField = Factory.field({
    name: 'Date',
    'data-type': FIELD_DATA_TYPES.DATE.key,
    ...sharedAttributes,
  });
  const dateTimeField = Factory.field({
    name: 'Date and Time',
    'data-type': FIELD_DATA_TYPES.DATETIME.key,
    ...sharedAttributes,
  });
  const geolocationField = Factory.field({
    name: 'Location',
    'data-type': FIELD_DATA_TYPES.GEOLOCATION.key,
    ...sharedAttributes,
  });
  const numberField = Factory.field({
    name: 'Number',
    'data-type': FIELD_DATA_TYPES.NUMBER.key,
    ...sharedAttributes,
  });
  const textField = Factory.field({
    name: 'Text',
    'data-type': FIELD_DATA_TYPES.TEXT.key,
    ...sharedAttributes,
  });
  const fields = [
    choiceField,
    dateField,
    dateTimeField,
    geolocationField,
    numberField,
    textField,
  ];

  const column = Factory.column({name: 'All'});
  const atlantaGaLocation = {lat: '33', lng: '-84'};

  const card = Factory.card({
    [choiceField.id]: 'fake_uuid_2',
    [dateField.id]: '2023-01-01',
    [dateTimeField.id]: new Date(2023, 1, 2, 13, 23, 45).toISOString(),
    [geolocationField.id]: atlantaGaLocation,
    [numberField.id]: 42,
    [textField.id]: 'Hello, world!',
  });

  it('supports viewing and editing a variety of field types', () => {
    cy.intercept('GET', 'http://cypressapi/boards?', {
      data: [board],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/elements?`, {
      data: fields,
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/columns?`, {
      data: [column],
    });
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards*`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/columns/${column.id}/cards*`, {
      data: [card],
    });
    cy.intercept('GET', `http://cypressapi/cards/${card.id}?`, {
      data: card,
    });

    cy.signIn();
    cy.contains(boardName).click();

    cy.step('CONFIRM SUMMARY READ-ONLY DISPLAY OF FIELDS', () => {
      cy.contains('Choice: Choice 2');
      cy.contains('Date: Sun Jan 1, 2023');
      cy.contains('Date and Time: Thu Feb 2, 2023 1:23 PM');
      cy.contains('Location: (33, -84)');
      cy.contains('Number: 42');
      cy.contains('Text: Hello, world!');
    });

    cy.step('OPEN CARD DETAILS', () => {
      cy.get(`[data-testid=card-${card.id}`).click();
    });

    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard');

    cy.step('TEST CHOICE FIELD', () => {
      cy.get(`[data-testid="choice-input-${choiceField.id}"]`).click();
      cy.get('[role=listbox]').contains('Choice 1').click();
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[choiceField.id]: 'fake_uuid_1'});
    });

    // The pickers render the accessible field DOM structure: instead of one
    // <input>, each part of the date is a contenteditable span with
    // role=spinbutton and an aria-label. Edit a single section so exactly one
    // change is emitted.

    cy.step('TEST DATE FIELD', () => {
      cy.get(`[data-testid="date-input-${dateField.id}"]`)
        .find('[aria-label="Day"]')
        .click()
        .type('2');
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[dateField.id]: '2023-01-02'});
    });

    cy.step('TEST DATE FIELD KEYBOARD NAVIGATION', () => {
      const dateInput = () =>
        cy.get(`[data-testid="date-input-${dateField.id}"]`);

      // arrow keys move focus between sections and step the focused section's
      // value; that section model is the point of the accessible DOM structure
      dateInput().find('[aria-label="Month"]').click().type('{rightArrow}');
      dateInput().find('[aria-label="Day"]').should('be.focused');
      dateInput().find('[aria-label="Day"]').type('{rightArrow}');
      dateInput().find('[aria-label="Year"]').should('be.focused');

      dateInput().find('[aria-label="Year"]').type('{upArrow}');
      // only the year is asserted: it steps 2023 -> 2024 regardless of which
      // day the step above left behind
      cy.wait('@updateCard')
        .its(`request.body.data.attributes["field-values"][${dateField.id}]`)
        .should('match', /^2024-/);
    });

    cy.step('TEST DATETIME FIELD', () => {
      cy.get(`[data-testid="datetime-input-${dateTimeField.id}"]`)
        .find('[aria-label="Minutes"]')
        .click()
        .type('45');
      // asserted through a local Date rather than a literal string: the value
      // is sent as UTC, so the expected string differs per time zone
      cy.wait('@updateCard')
        .its(
          `request.body.data.attributes["field-values"][${dateTimeField.id}]`,
        )
        .then(value => {
          const sent = new Date(value);
          expect(sent.getHours()).to.equal(13);
          expect(sent.getMinutes()).to.equal(45);
        });
    });

    cy.step('TEST GEOLCOATION FIELD', () => {
      cy.get(
        `[data-testid=number-input-${geolocationField.id}-latitude]`,
      ).clear();
      cy.wait('@updateCard');
      cy.get(`[data-testid=number-input-${geolocationField.id}-latitude]`).type(
        27,
      );
      cy.wait('@updateCard')
        .its(
          `request.body.data.attributes["field-values"][${geolocationField.id}]`,
        )
        .should('deep.equal', {lat: '27', lng: '-84'});

      cy.get(
        `[data-testid=number-input-${geolocationField.id}-longitude]`,
      ).clear();
      cy.wait('@updateCard');
      cy.get(
        `[data-testid=number-input-${geolocationField.id}-longitude]`,
      ).type(42);
      cy.wait('@updateCard')
        .its(
          `request.body.data.attributes["field-values"][${geolocationField.id}]`,
        )
        .should('deep.equal', {lat: '27', lng: '42'});
    });

    cy.step('TEST NUMBER FIELD', () => {
      cy.get(`[data-testid=number-input-${numberField.id}]`).clear();
      cy.wait('@updateCard');
      cy.get(`[data-testid=number-input-${numberField.id}]`).type(27);
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[numberField.id]: '27'});
    });

    cy.step('TEST TEXT FIELD', () => {
      cy.get(`[data-testid=text-input-${textField.id}]`).clear();
      cy.wait('@updateCard');
      cy.get(`[data-testid=text-input-${textField.id}]`).type('Greetings');
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[textField.id]: 'Greetings'});
    });
  });
});
