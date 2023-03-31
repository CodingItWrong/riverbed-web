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
  });
});
