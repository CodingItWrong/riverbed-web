import QUERIES from './queries';

describe('QUERIES', () => {
  describe('IS_EMPTY', () => {
    test.each(['hello', '0'])('returns false for %j', value => {
      expect(QUERIES.IS_EMPTY.match(value)).toBe(false);
    });

    test.each(['', null, undefined])('returns true for %j', value => {
      expect(QUERIES.IS_EMPTY.match(value)).toBe(true);
    });
  });
});
