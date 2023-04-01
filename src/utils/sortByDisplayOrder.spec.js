import sortByDisplayOrder from './sortByDisplayOrder';

describe('sortByDisplayOrder', () => {
  it('returns elements in order of the display-order field', () => {
    const cards = [
      {attributes: {'display-order': 3}},
      {attributes: {'display-order': 1}},
      {attributes: {'display-order': null}},
      {attributes: {'display-order': 2}},
    ];

    expect(sortByDisplayOrder(cards)).toEqual([
      {attributes: {'display-order': 1}},
      {attributes: {'display-order': 2}},
      {attributes: {'display-order': 3}},
      {attributes: {'display-order': null}},
    ]);
  });
});
