import dateUtils from './dateUtils';

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
});
