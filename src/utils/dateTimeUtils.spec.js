import dateTimeUtils from './dateTimeUtils';

describe('dateTimeUtils', () => {
  function getComponents(date) {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ];
  }

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

  describe('objectToServerString', () => {
    it('returns null for null', () => {
      expect(dateTimeUtils.objectToServerString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateTimeUtils.objectToServerString('')).toEqual('');
    });

    it('parses YYYY-MM-DD format', () => {
      const date = new Date(Date.UTC(2023, 2, 4, 13, 23, 45, 678));
      expect(dateTimeUtils.objectToServerString(date)).toEqual(
        '2023-03-04T13:23:45.678Z',
      );
    });

    it('returns "Invalid Date" for non-dates', () => {
      expect(dateTimeUtils.objectToServerString('whatev')).toEqual(
        'Invalid Date',
      );
    });
  });

  describe('serverStringToHumanString', () => {
    it('formats dates', () => {
      expect(
        dateTimeUtils.serverStringToHumanString('2023-03-04Z13:23:45.678Z'),
      ).toEqual('Sat Mar 4, 2023 8:23:45 AM'); // TODO: make not time zone specific somehow
    });

    it('returns null for null', () => {
      expect(dateTimeUtils.serverStringToHumanString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateTimeUtils.serverStringToHumanString('')).toEqual('');
    });

    it('returns "Invalid Date" for non-date strings', () => {
      expect(dateTimeUtils.serverStringToHumanString('whatev')).toEqual(
        'Invalid Date',
      );
    });
  });

  describe('serverStringToHumanTimeString', () => {
    it('formats the time portion of dates', () => {
      expect(
        dateTimeUtils.serverStringToHumanTimeString('2023-03-04Z13:23:45.678Z'),
      ).toEqual('8:23:45 AM'); // TODO: make not time zone specific somehow
    });

    it('returns null for null', () => {
      expect(dateTimeUtils.serverStringToHumanTimeString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateTimeUtils.serverStringToHumanTimeString('')).toEqual('');
    });

    it('returns "Invalid Date" for non-date strings', () => {
      expect(dateTimeUtils.serverStringToHumanTimeString('whatev')).toEqual(
        'Invalid Date',
      );
    });
  });

  describe('serverStringToObject', () => {
    it('returns null for null', () => {
      expect(dateTimeUtils.serverStringToObject(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateTimeUtils.serverStringToObject('')).toEqual('');
    });

    it('parses YYYY-MM-DD format', () => {
      const result = dateTimeUtils.serverStringToObject(
        '2023-03-04T13:23:45.678Z',
      );
      expect(getComponents(result)).toEqual([2023, 2, 4, 8, 23, 45, 678]); // TODO: make not time zone specific somehow
    });

    it('returns null for non-date strings', () => {
      expect(dateTimeUtils.serverStringToObject('whatev')).toEqual(null);
    });
  });
});
