import {groupCards} from '../../../src/utils/cardGroups';

describe('card groups', () => {
  it('returns no card groups if there are no cards', () => {
    const cardGroups = groupCards([]);

    expect(cardGroups).to.deep.equal([]);
  });

  it('returns all cards when catch-all group is specified', () => {
    const columnCards = ['something'];
    const cardGrouping = {field: null, direction: null};

    const cardGroups = groupCards(columnCards, cardGrouping);
    expect(cardGroups).to.deep.equal([{value: null, data: columnCards}]);
  });
});
