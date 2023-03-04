import QUERIES from './queries';

describe('QUERIES', () => {
  describe('IS_EMPTY', () => {
    it('returns false for a non-empty string', () => {
      expect(QUERIES.IS_EMPTY.match('hello')).toBe(false);
    });

    it('returns true for null', () => {
      expect(QUERIES.IS_EMPTY.match(null)).toBe(true);
    });
  });
});
