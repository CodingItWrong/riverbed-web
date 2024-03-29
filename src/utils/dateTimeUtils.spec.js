import nowFn from '../utils/now';
import dateTimeUtils from './dateTimeUtils';

jest.mock('../utils/now');

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

  describe('objectToHumanTimeString', () => {
    it('returns null for null', () => {
      expect(dateTimeUtils.objectToHumanTimeString(null)).toEqual(null);
    });

    it('returns empty string for empty string', () => {
      expect(dateTimeUtils.objectToHumanTimeString('')).toEqual('');
    });

    // it('formats a date object in human-readable format', () => {
    //   const date = new Date(Date.UTC(2023, 2, 4, 13, 23, 45, 678));
    //   expect(dateTimeUtils.objectToHumanTimeString(date)).toEqual(
    //     'Sat Mar 4, 2023 8:23:45 AM',
    //   );
    // });

    it('returns "Invalid Date" for non-dates', () => {
      expect(dateTimeUtils.objectToHumanTimeString('whatev')).toEqual(
        'Invalid Date',
      );
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
    /*
    it('formats dates', () => {
      expect(
        dateTimeUtils.serverStringToHumanString('2023-03-04Z13:23:45.678Z'),
      ).toEqual('Sat Mar 4, 2023 8:23:45 AM'); // TODO: make not time zone specific somehow
    });
    */

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
    /*
    it('formats the time portion of dates', () => {
      expect(
        dateTimeUtils.serverStringToHumanTimeString('2023-03-04Z13:23:45.678Z'),
      ).toEqual('8:23:45 AM'); // TODO: make not time zone specific somehow
    });
    */

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

    /*
    it('parses YYYY-MM-DD format', () => {
      const result = dateTimeUtils.serverStringToObject(
        '2023-03-04T13:23:45.678Z',
      );
      expect(getComponents(result)).toEqual([2023, 2, 4, 8, 23, 45, 678]); // TODO: make not time zone specific somehow
    });
    */

    it('returns null for non-date strings', () => {
      expect(dateTimeUtils.serverStringToObject('whatev')).toEqual(null);
    });
  });

  describe('setDate', () => {
    it('overwrites the month day and year of the date', () => {
      const oldDateObject = new Date(2023, 2, 4, 13, 23, 45, 678);
      const newDateObject = new Date(2021, 8, 9, 14, 0, 0);
      const result = dateTimeUtils.setDate({oldDateObject, newDateObject});
      expect(getComponents(result)).toEqual([2021, 8, 9, 13, 23, 45, 678]);
    });

    it('uses zero time values if the old date is null', () => {
      const newDateObject = new Date(2021, 8, 9, 13, 45, 678);
      const result = dateTimeUtils.setDate({
        oldDateObject: null,
        newDateObject,
      });
      expect(getComponents(result)).toEqual([2021, 8, 9, 0, 0, 0, 0]);
    });
  });

  describe('setTime', () => {
    const now = new Date(2023, 0, 1, 0, 0, 0);
    beforeEach(() => {
      nowFn.mockReturnValue(now);
    });

    it('overwrites the hours and minutes of the date, and clears seconds and millis', () => {
      const dateObject = new Date(Date.UTC(2023, 2, 4, 13, 23, 45, 678));
      const newDateObject = dateTimeUtils.setTime({
        dateObject,
        hour: 2,
        minute: 27,
      });
      expect(getComponents(newDateObject)).toEqual([2023, 2, 4, 2, 27, 0, 0]);
    });

    it('uses the current date if null', () => {
      const newDateObject = dateTimeUtils.setTime({
        dateObject: null,
        hour: 2,
        minute: 27,
      });
      expect(getComponents(newDateObject)).toEqual([2023, 0, 1, 2, 27, 0, 0]);
    });
  });
});
