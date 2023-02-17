import {groupCards} from '../../../src/utils/cardGroups';

describe('card groups', () => {
  it('returns no card groups if there are no cards', () => {
    //todo
    expect(groupCards([])).to.deep.equal([]);
  });
});
