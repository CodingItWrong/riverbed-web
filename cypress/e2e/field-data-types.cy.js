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
  const atlantaGaLocation = {lat: '33.7489954', lng: '-84.3879824'};

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
    cy.intercept('GET', `http://cypressapi/boards/${board.id}/cards?`, {
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
      cy.contains('Date and Time: Thu Feb 2, 2023 1:23:45 PM');
      cy.contains('Location: (33.7489954, -84.3879824)');
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
      cy.get(`[data-testid="choice-input-${choiceField.id}"]`).paperSelect(
        'Choice 1',
      );
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[choiceField.id]: 'fake_uuid_1'});
    });

    cy.step('TEST DATE FIELD', () => {
      cy.get(`[data-testid="element-${dateField.id}"] [role=button]`).click();
      cy.get('[role=button]').contains(/^2$/).click();
      cy.get('[data-testid=react-native-paper-dates-save-text]').click();
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[dateField.id]: '2023-01-02'});
    });

    cy.step('TEST DATETIME FIELD', () => {
      cy.get(`[data-testid=date-input-${dateTimeField.id}`).click();
      cy.get('[role=button]').contains(/^3$/).click();
      cy.get('[data-testid=react-native-paper-dates-save-text]').click();
      cy.wait('@updateCard'); // not verifying contents due to time zone issues

      cy.get(`[data-testid=time-input-${dateTimeField.id}`).click();
      cy.get('[aria-modal=true]');
      cy.get('[aria-modal=true] input[inputmode=numeric]')
        .eq(0)
        .clear({force: true})
        .type('4', {force: true});
      cy.get('[aria-modal=true] input[inputmode=numeric]')
        .eq(1)
        .clear({force: true})
        .type('56', {force: true});
      cy.get('[role=button]').contains('Ok').click();
      cy.wait('@updateCard'); // not verifying contents due to time zone issues
    });

    cy.step('TEST GEOLCOATION FIELD', () => {
      cy.get(`[data-testid=number-input-${geolocationField.id}-latitude]`)
        .clear()
        .type(27);
      cy.wait('@updateCard')
        .its(
          `request.body.data.attributes["field-values"][${geolocationField.id}]`,
        )
        .should('deep.include', {lat: '27'});

      cy.get(`[data-testid=number-input-${geolocationField.id}-longitude]`)
        .clear()
        .type(42);
      cy.wait('@updateCard')
        .its(
          `request.body.data.attributes["field-values"][${geolocationField.id}]`,
        )
        .should('deep.include', {lng: '42'});
    });

    cy.step('TEST NUMBER FIELD', () => {
      cy.get(`[data-testid=number-input-${numberField.id}]`).clear().type(27);
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[numberField.id]: '27'});
    });

    cy.step('TEST TEXT FIELD', () => {
      cy.get(`[data-testid=text-input-${textField.id}]`)
        .clear()
        .type('Greetings');
      cy.wait('@updateCard')
        .its('request.body.data.attributes["field-values"]')
        .should('deep.include', {[textField.id]: 'Greetings'});
    });
  });
});
