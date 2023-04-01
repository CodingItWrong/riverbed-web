import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import QUERIES from '../enums/queries';
import checkConditions from './checkConditions';

describe('checkConditions', () => {
  const elements = [
    {id: '26', attributes: {'data-type': FIELD_DATA_TYPES.TEXT.key}},
    {id: '27', attributes: {'data-type': FIELD_DATA_TYPES.TEXT.key}},
  ];

  it('returns true if conditions is null', () => {
    expect(checkConditions({conditions: null, elements})).toEqual(true);
  });

  it('returns true if conditions is missing a field', () => {
    const conditions = [{field: null, query: QUERIES.IS_EMPTY}];
    expect(checkConditions({conditions, elements})).toEqual(true);
  });

  it('returns true if conditions is missing a query', () => {
    const conditions = [{field: '27', query: null}];
    expect(checkConditions({conditions, elements})).toEqual(true);
  });

  it('returns true if the field values match the conditions', () => {
    const fieldValues = {26: 'a value', 27: null};
    const conditions = [
      {field: '26', query: QUERIES.IS_NOT_EMPTY.key},
      {field: '27', query: QUERIES.IS_EMPTY.key},
    ];
    expect(checkConditions({fieldValues, conditions, elements})).toEqual(true);
  });

  it('returns false if the field values fail any condition', () => {
    const fieldValues = {26: 'a value', 27: null};
    const conditions = [
      {field: '26', query: QUERIES.IS_EMPTY.key},
      {field: '27', query: QUERIES.IS_EMPTY.key},
    ];
    expect(checkConditions({fieldValues, conditions, elements})).toEqual(false);
  });

  it('supports complex queries', () => {
    const fieldValues = {26: 'capybara', 27: null};
    const conditions = [
      {field: '26', query: QUERIES.CONTAINS.key, options: {value: 'yba'}},
    ];
    expect(checkConditions({fieldValues, conditions, elements})).toEqual(true);
  });
});
