import QUERIES from './queries';

describe('QUERIES', () => {
  describe('EMPTY', () => {
    const EMPTY_VALUES = ['', null, undefined];
    const NOT_EMPTY_VALUES = ['hello', '0'];

    describe('IS_EMPTY', () => {
      test.each(EMPTY_VALUES)('returns true for %j', value => {
        expect(QUERIES.IS_EMPTY.match(value)).toBe(true);
      });

      test.each(NOT_EMPTY_VALUES)('returns false for %j', value => {
        expect(QUERIES.IS_EMPTY.match(value)).toBe(false);
      });
    });

    describe('IS_NOT_EMPTY', () => {
      test.each(EMPTY_VALUES)('returns true for %j', value => {
        expect(QUERIES.IS_NOT_EMPTY.match(value)).toBe(false);
      });

      test.each(NOT_EMPTY_VALUES)('returns false for %j', value => {
        expect(QUERIES.IS_NOT_EMPTY.match(value)).toBe(true);
      });
    });
  });
});
