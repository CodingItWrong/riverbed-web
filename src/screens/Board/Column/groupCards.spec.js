import FIELD_DATA_TYPES from '../../../enums/fieldDataTypes';
import SORT_DIRECTIONS from '../../../enums/sortDirections';
import groupCards from './groupCards';

// TODO: ideally reorganize code to remove this dependency
jest.mock('../../../components/Map', () => ({}));

describe('groupCards', () => {
  const textField = {
    id: 'fieldId',
    attributes: {'data-type': FIELD_DATA_TYPES.TEXT.key},
  };
  const elements = [textField];
  const cardA1 = {
    id: '1',
    attributes: {'field-values': {[textField.id]: 'a'}},
  };
  const cardA2 = {
    id: '3',
    attributes: {'field-values': {[textField.id]: 'a'}},
  };
  const cardB1 = {
    id: '2',
    attributes: {'field-values': {[textField.id]: 'b'}},
  };
  const cardC1 = {
    id: '4',
    attributes: {'field-values': {[textField.id]: 'c'}},
  };
  const cardNull = {
    id: '5',
    attributes: {'field-values': {[textField.id]: null}},
  };
  const cardUndefined = {
    id: '6',
    attributes: {'field-values': {[textField.id]: undefined}},
  };
  const cardAbsentKey = {
    id: '7',
    attributes: {'field-values': {}},
  };
  const columnCards = [
    cardC1,
    cardA1,
    cardB1,
    cardA2,
    cardNull,
    cardUndefined,
    cardAbsentKey,
  ];

  it('returns cards grouped by the configured field', () => {
    const cardGrouping = {
      field: textField.id,
      direction: SORT_DIRECTIONS.ASCENDING.key,
    };

    const result = groupCards({columnCards, cardGrouping, elements});

    expect(result).toEqual([
      {value: 'a', data: [cardA1, cardA2]},
      {value: 'b', data: [cardB1]},
      {value: 'c', data: [cardC1]},
      {value: null, data: [cardNull, cardUndefined, cardAbsentKey]},
    ]);
  });

  it('supports descending order', () => {
    const cardGrouping = {
      field: textField.id,
      direction: SORT_DIRECTIONS.DESCENDING.key,
    };

    const result = groupCards({columnCards, cardGrouping, elements});

    expect(result).toEqual([
      {value: null, data: [cardNull, cardUndefined, cardAbsentKey]},
      {value: 'c', data: [cardC1]},
      {value: 'b', data: [cardB1]},
      {value: 'a', data: [cardA1, cardA2]},
    ]);
  });

  it('returns no groups when there is a grouping but no cards', () => {
    const cardGrouping = {
      field: textField.id,
      direction: SORT_DIRECTIONS.DESCENDING.key,
    };
    const result = groupCards({columnCards: [], cardGrouping, elements});
    expect(result).toEqual([]);
  });

  it('returns one group with all cards when there is no grouping config', () => {
    const result = groupCards({columnCards, cardGrouping: null});
    expect(result).toEqual([{value: null, data: columnCards}]);
  });

  it('returns no groups when there is no grouping and no cards', () => {
    const result = groupCards({columnCards: [], cardGrouping: null});
    expect(result).toEqual([]);
  });
});
