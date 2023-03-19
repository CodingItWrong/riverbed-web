import FIELD_DATA_TYPES from '../../../enums/fieldDataTypes';
import SORT_DIRECTIONS from '../../../enums/sortDirections';
import groupCards from './groupCards';

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

  it('returns cards grouped by the configured field', () => {
    const cardGrouping = {
      field: textField.id,
      direction: SORT_DIRECTIONS.DESCENDING.key,
    };
    const columnCards = [cardA1, cardB1, cardA2];

    const result = groupCards({columnCards, cardGrouping, elements});

    expect(result).toEqual([
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
    const columnCards = ['a', 'b', 'c'];
    const result = groupCards({columnCards, cardGrouping: null});
    expect(result).toEqual([{value: null, data: columnCards}]);
  });

  it('returns an empty group when there is no grouping and no cards', () => {
    const columnCards = [];
    const result = groupCards({columnCards, cardGrouping: null});
    expect(result).toEqual([{value: null, data: columnCards}]);
  });
});
