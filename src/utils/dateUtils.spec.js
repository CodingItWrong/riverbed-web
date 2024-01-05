import nowFn from '../utils/now';
import dateUtils from './dateUtils';

jest.mock('../utils/now');

describe('dateUtils', () => {
  function getComponents(date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()];
  }

  describe('addDays', () => {
    it('returns a date one day later than what is passed', () => {
      const date = new Date(2023, 0, 1);
      const result = dateUtils.addDays(date, 3);
      expect(getComponents(result)).toEqual([2023, 0, 4]);
    });

    it('rolls over months', () => {
      const date = new Date(2023, 0, 31);
      const result = dateUtils.addDays(date, 1);
      expect(getComponents(result)).toEqual([2023, 1, 1]);
    });

    it('rolls over years', () => {
      const date = new Date(2023, 11, 31);
      const result = dateUtils.addDays(date, 1);
      expect(getComponents(result)).toEqual([2024, 0, 1]);
    });

    it('handles negative days', () => {
      const date = new Date(2023, 0, 4);
      const result = dateUtils.addDays(date, -3);
      expect(getComponents(result)).toEqual([2023, 0, 1]);
    });

    it('handles negative rollovers', () => {
      const date = new Date(2023, 1, 1);
      const result = dateUtils.addDays(date, -1);
      expect(getComponents(result)).toEqual([2023, 0, 31]);
    });
  });

  describe('isCurrentMonth', () => {
    const now = new Date('2022-03-04T00:00:00.000Z');
    const CASES = [
      ['2022-03-01', true],
      ['2022-03-04', true],
      ['2022-03-05', true],
      ['2022-03-31', true],
      ['2022-04-01', false],
      ['2022-02-28', false],
      ['2021-03-04', false],
      ['2023-03-04', false],
      ['not a date', false],
      ['', false],
      [null, false],
      [undefined, false],
    ];

    beforeEach(() => {
      nowFn.mockReturnValue(now);
    });

    test.each(CASES)(
      `when testing %j at ${now} returns %j`,
      (value, result) => {
        expect(dateUtils.isCurrentMonth(value)).toBe(result);
      },
    );
  });

  describe('isMonthOffset', () => {
    const now = new Date('2022-03-04T00:00:00.000Z');
    const CASES = [
      ['2022-03-01', false],
      ['2022-03-04', false],
      ['2022-03-31', false],
      ['2022-04-01', false],
      ['2022-02-01', true],
      ['2022-02-28', true],
      ['2021-02-04', false],
      ['2023-02-04', false],
      ['not a date', false],
      ['', false],
      [null, false],
      [undefined, false],
    ];

    beforeEach(() => {
      nowFn.mockReturnValue(now);
    });

    test.each(CASES)(
      `when testing %j at ${now} returns %j`,
      (value, result) => {
        expect(dateUtils.isMonthOffset(value, -1)).toBe(result);
      },
    );

    it('handles year changes', () => {
      const januaryDate = new Date('2024-01-04T00:00:00.000Z');
      nowFn.mockReturnValue(januaryDate);

      const decemberDateString = '2023-12-30';
      expect(dateUtils.isMonthOffset(decemberDateString, -1)).toBe(true);
    });
  });

  describe('serverStringToObject', () => {
    it('returns null for null', () => {
      expect(dateUtils.serverStringToObject(null)).toEqual(null);
    });

    it('returns null for empty string', () => {
      expect(dateUtils.serverStringToObject('')).toEqual(null);
    });

    it('parses YYYY-MM-DD format', () => {
      const result = dateUtils.serverStringToObject('2023-03-04');
      expect(getComponents(result)).toEqual([2023, 2, 4]);
    });

    it('returns null for non-date strings', () => {
      expect(dateUtils.serverStringToObject('whatev')).toEqual(null);
    });
  });

  describe('serverStringToHumanString', () => {
    it('formats dates', () => {
      expect(dateUtils.serverStringToHumanString('2023-03-04')).toEqual(
        'Sat Mar 4, 2023',
      );
    });

    it('returns null for null', () => {
      expect(dateUtils.serverStringToHumanString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateUtils.serverStringToHumanString('')).toEqual('');
    });

    it('returns "Invalid Date" for non-date strings', () => {
      expect(dateUtils.serverStringToHumanString('whatev')).toEqual(
        'Invalid Date',
      );
    });
  });

  describe('objectToServerString', () => {
    it('returns null for null', () => {
      expect(dateUtils.objectToServerString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateUtils.objectToServerString('')).toEqual('');
    });

    it('parses YYYY-MM-DD format', () => {
      const date = new Date(2023, 2, 4);
      expect(dateUtils.objectToServerString(date)).toEqual('2023-03-04');
    });

    it('returns "Invalid Date" for non-dates', () => {
      expect(dateUtils.objectToServerString('whatev')).toEqual('Invalid Date');
    });
  });
});
