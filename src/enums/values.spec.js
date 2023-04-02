import nowFn from '../utils/now';
import FIELD_DATA_TYPES from './fieldDataTypes';
import VALUES from './values';

jest.mock('../utils/now');

describe('VALUES', () => {
  describe('NOW', () => {
    const CASES = [
      [FIELD_DATA_TYPES.DATE.key, '2022-03-04'],
      [FIELD_DATA_TYPES.DATETIME.key, '2022-03-04T12:00:00.000Z'],
      [FIELD_DATA_TYPES.TEXT.key, 'Fri Mar 4, 2022 7:00:00 AM'],
    ];

    const now = new Date('2022-03-04T12:00:00.000Z');
    beforeEach(() => {
      nowFn.mockReturnValue(now);
    });

    test.each(CASES)(
      `when setting a %j field to NOW at ${now} returns %j`,
      (fieldDataType, result) => {
        expect(VALUES.NOW.call(fieldDataType)).toBe(result);
      },
    );
  });
});
