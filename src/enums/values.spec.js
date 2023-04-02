import nowFn from '../utils/now';
import FIELD_DATA_TYPES from './fieldDataTypes';
import VALUES from './values';

jest.mock('../utils/now');

describe('VALUES', () => {
  describe('NOW', () => {
    const VALID_CASES = [
      [FIELD_DATA_TYPES.DATE.key, '2022-03-04'],
      [FIELD_DATA_TYPES.DATETIME.key, '2022-03-04T12:00:00.000Z'],
      [FIELD_DATA_TYPES.TEXT.key, 'Fri Mar 4, 2022 7:00:00 AM'],
    ];

    const INVALID_CASES = [
      FIELD_DATA_TYPES.CHOICE.key,
      FIELD_DATA_TYPES.GEOLOCATION.key,
      FIELD_DATA_TYPES.NUMBER.key,
    ];

    const now = new Date('2022-03-04T12:00:00.000Z');

    let consoleError;

    beforeEach(() => {
      nowFn.mockReturnValue(now);

      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockReset();
    });

    test.each(VALID_CASES)(
      `when setting a %j field to NOW at ${now} returns %j`,
      (fieldDataType, result) => {
        expect(VALUES.NOW.call(fieldDataType)).toBe(result);
      },
    );

    test.each(INVALID_CASES)(
      `when setting a %j field to NOW at ${now} returns null`,
      fieldDataType => {
        expect(VALUES.NOW.call(fieldDataType)).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
          `VALUES.NOW is not valid for data type "${fieldDataType}"`,
        );
      },
    );
  });
});
