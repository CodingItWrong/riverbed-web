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

  it('returns an empty array when there is a cardGrouping but no cards', () => {
    const cardGrouping = {field: 'dummy', direction: 'dummy'};
    const cardGroups = groupCards([], cardGrouping);
    expect(cardGroups).to.deep.equal([]);
  });

  it('when the card grouping matches the card it returns a single grouping with the value of the card ', () => {
    const cardGrouping = {field: '27', direction: 'dummy'};
    const columnCards = [
      {
        attributes: {
          'field-values': {
            27: 'a',
          },
        },
      },
    ];
    const cardGroups = groupCards(columnCards, cardGrouping);
    expect(cardGroups).to.deep.equal([{value: 'a', data: columnCards}]);
  });

  it('when the card grouping does not match the card it returns a single grouping with undefined', () => {
    const cardGrouping = {field: '27', direction: 'dummy'};
    const columnCards = [
      {
        attributes: {
          'field-values': {
            42: 'a',
          },
        },
      },
    ];
    const cardGroups = groupCards(columnCards, cardGrouping);
    expect(cardGroups).to.deep.equal([{value: undefined, data: columnCards}]);
  });

  it('when cards have different grouping values, it puts them in separate groups', () => {
    const cardGrouping = {field: '27', direction: 'dummy'};
    const cardA = {
      attributes: {
        'field-values': {27: 'a'},
      },
      id: 'a',
    };
    const cardB = {
      attributes: {
        'field-values': {27: 'b'},
      },
      id: 'b',
    };
    const cardA2 = {
      attributes: {
        'field-values': {27: 'a'},
      },
      id: 'a2',
    };
    // TODO: do we want an "undefined" grouping in this test?
    const columnCards = [cardA, cardB, cardA2];
    const cardGroups = groupCards(columnCards, cardGrouping);
    expect(cardGroups.length).to.equal(2);
    expect(cardGroups[0]).to.deep.equal({value: 'a', data: [cardA, cardA2]});
    expect(cardGroups[1]).to.deep.equal({value: 'b', data: [cardB]});
  });

  // TODO: test direction values. a 2/1 but order the two
});
