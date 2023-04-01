import dateTimeUtils from './dateTimeUtils';

describe('dateTimeUtils', () => {
  describe('getTime', () => {
    it('returns the time components', () => {
      const date = new Date(2023, 0, 1, 13, 23, 45, 678);
      expect(dateTimeUtils.getTime(date)).toEqual({
        hour: 13,
        minute: 23,
        second: 45,
        millisecond: 678,
      });
    });

    it('returns zero values for null', () => {
      expect(dateTimeUtils.getTime(null)).toEqual({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    });

    it('returns null for a non-date', () => {
      expect(dateTimeUtils.getTime('not a date')).toBeNull();
    });
  });
});
