import nowFn from '../utils/now';
import FIELD_DATA_TYPES from './fieldDataTypes';
import QUERIES from './queries';

jest.mock('../utils/now');

describe('QUERIES', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('EQUALS_VALUE', () => {
    const CONFIGURED_VALUE = 'a';
    const CASES = [
      ['a', true],
      ['b', false],
      ['aa', false],
      ['A', false],
      ['á', false],
      ['', false],
      [null, false],
      [undefined, false],
    ];

    test.each(CASES)(
      'when testing "a" against %j returns %j',
      (value, result) => {
        expect(
          QUERIES.EQUALS_VALUE.match(value, null, {value: CONFIGURED_VALUE}),
        ).toBe(result);
      },
    );
  });

  test.todo('DOES_NOT_EQUAL_VALUE');

  describe('EMPTY', () => {
    const EMPTY_CASES = [
      ['', true],
      [null, true],
      [undefined, true],
      ['hello', false],
      ['0', false],
    ];

    describe('IS_EMPTY', () => {
      test.each(EMPTY_CASES)('when %j returns %j', (value, result) => {
        expect(QUERIES.IS_EMPTY.match(value)).toBe(result);
      });
    });

    describe('IS_NOT_EMPTY', () => {
      test.each(EMPTY_CASES)('returns true for %j', (value, result) => {
        const invertedResultForNotEmptyCheck = !result;
        expect(QUERIES.IS_NOT_EMPTY.match(value)).toBe(
          invertedResultForNotEmptyCheck,
        );
      });
    });
  });

  describe('EMPTY_OR_EQUALS', () => {
    const CONFIGURED_VALUE = 'a';
    const CASES = [
      ['a', true],
      ['', true],
      [null, true],
      [undefined, true],
      ['b', false],
      ['aa', false],
      ['A', false],
      ['á', false],
    ];

    test.each(CASES)(
      'returns true when testing "a" against %j',
      (value, result) => {
        expect(
          QUERIES.IS_EMPTY_OR_EQUALS.match(value, null, {
            value: CONFIGURED_VALUE,
          }),
        ).toBe(result);
      },
    );
  });

  describe('FUTURE', () => {
    describe('dates', () => {
      const now = new Date('2022-03-04T12:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATE.key;
      const FUTURE_CASES = [
        ['2022-03-05', true],
        ['2022-04-01', true],
        ['2024-01-01', true],
        ['2022-03-04', false],
        ['2022-03-03', false],
        ['2022-02-28', false],
        ['2021-12-31', false],
      ];
      const INVALID_CASES = [
        // ['not a date', false], // TODO: erroring
        ['', false],
        [null, false],
        [undefined, false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_FUTURE', () => {
        test.each(FUTURE_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_FUTURE.match(value, dataType)).toBe(result);
          },
        );

        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_FUTURE.match(value, dataType)).toBe(result);
          },
        );
      });

      describe('IS_NOT_FUTURE', () => {
        test.each(FUTURE_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_FUTURE.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        // TODO: incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_FUTURE.match(value, dataType)).toBe(result);
          },
        );
      });
    });

    describe('datetimes', () => {
      const now = new Date('2022-03-04T12:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATETIME.key;
      const FUTURE_CASES = [
        ['2022-03-04T12:00:00.001Z', true],
        ['2022-03-05T00:00:00.000Z', true],
        ['2022-04-01T00:00:00.000Z', true],
        ['2024-01-01T00:00:00.000Z', true],
        ['2022-03-04T12:00:00.000Z', false],
        ['2022-03-04T11:59:59.999Z', false],
        ['2022-03-03T00:00:00.000Z', false],
        ['2022-02-28T00:00:00.000Z', false],
        ['2021-12-31T00:00:00.000Z', false],
      ];
      const INVALID_CASES = [
        // ['not a date', false], // TODO: erroring
        ['', false],
        [null, false],
        [undefined, false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_FUTURE', () => {
        test.each(FUTURE_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_FUTURE.match(value, dataType)).toBe(result);
          },
        );

        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_FUTURE.match(value, dataType)).toBe(result);
          },
        );
      });

      describe('IS_NOT_FUTURE', () => {
        test.each(FUTURE_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_FUTURE.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        // TODO: incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_FUTURE.match(value, dataType)).toBe(result);
          },
        );
      });
    });
  });

  describe('PAST', () => {
    describe('dates', () => {
      const now = new Date('2022-03-04T12:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATE.key;
      const PAST_CASES = [
        ['2022-03-05', false],
        ['2022-04-01', false],
        ['2024-01-01', false],
        ['2022-03-04', false],
        ['2022-03-03', true],
        ['2022-02-28', true],
        ['2021-12-31', true],
      ];
      const INVALID_CASES = [
        // ['not a date', false], // TODO: erroring
        ['', false],
        [null, false],
        [undefined, false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_PAST', () => {
        test.each(PAST_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_PAST.match(value, dataType)).toBe(result);
          },
        );

        // TODO: one incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_PAST.match(value, dataType)).toBe(result);
          },
        );
      });

      describe('IS_NOT_PAST', () => {
        test.each(PAST_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_PAST.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        // TODO: two incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_PAST.match(value, dataType)).toBe(result);
          },
        );
      });
    });

    describe('datetimes', () => {
      const now = new Date('2022-03-04T12:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATETIME.key;
      const PAST_CASES = [
        ['2022-03-04T12:00:00.001Z', false],
        ['2022-03-05T00:00:00.000Z', false],
        ['2022-04-01T00:00:00.000Z', false],
        ['2024-01-01T00:00:00.000Z', false],
        ['2022-03-04T12:00:00.000Z', false],
        ['2022-03-04T11:59:59.999Z', true],
        ['2022-03-03T00:00:00.000Z', true],
        ['2022-02-28T00:00:00.000Z', true],
        ['2021-12-31T00:00:00.000Z', true],
      ];
      const INVALID_CASES = [
        // ['not a date', false], // TODO: erroring
        ['', false],
        [null, false],
        [undefined, false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_PAST', () => {
        test.each(PAST_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_PAST.match(value, dataType)).toBe(result);
          },
        );

        // TODO: one incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_PAST.match(value, dataType)).toBe(result);
          },
        );
      });

      describe('IS_NOT_PAST', () => {
        test.each(PAST_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_PAST.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        // TODO: two incorrectly inverted
        test.skip.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_PAST.match(value, dataType)).toBe(result);
          },
        );
      });
    });
  });

  describe('CURRENT_MONTH', () => {
    describe('dates', () => {
      const now = new Date('2022-03-04T00:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATE.key;
      const CURRENT_MONTH_CASES = [
        ['2022-03-01', true],
        ['2022-03-04', true],
        ['2022-03-05', true],
        ['2022-03-31', true],
        ['2022-04-01', false],
        ['2022-02-28', false],
        ['2021-03-04', false],
        ['2023-03-04', false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_CURRENT_MONTH', () => {
        test.each(CURRENT_MONTH_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );

        const INVALID_CASES = [
          ['not a date', false],
          // TODO: all the following should be false
          ['', true],
          [null, true],
          [undefined, true],
        ];
        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );
      });

      describe('IS_NOT_CURRENT_MONTH', () => {
        test.each(CURRENT_MONTH_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_CURRENT_MONTH.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        const INVALID_CASES = [
          ['not a date', true], // TODO: should be false
          ['', false],
          [null, false],
          [undefined, false],
        ];
        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );
      });
    });

    describe('datetimes', () => {
      const now = new Date('2022-03-04T00:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATETIME.key;
      const CURRENT_MONTH_CASES = [
        ['2022-03-01T12:00:00.000Z', true], // staying away from time zone changes
        ['2022-03-04T00:00:00.000Z', true],
        ['2022-03-05T00:00:00.000Z', true],
        ['2022-03-31T11:59:59.999Z', true],
        ['2022-04-01T12:00:00.000Z', false], // staying away from time zone changes
        ['2022-02-28T00:00:00.000Z', false],
        ['2021-03-04T00:00:00.000Z', false],
        ['2023-03-04T00:00:00.000Z', false],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      describe('IS_CURRENT_MONTH', () => {
        test.each(CURRENT_MONTH_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );

        const INVALID_CASES = [
          ['not a date', false],
          // TODO: all the following should be false
          ['', true],
          [null, true],
          [undefined, true],
        ];
        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );
      });

      describe('IS_NOT_CURRENT_MONTH', () => {
        test.each(CURRENT_MONTH_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            const invertedResult = !result;
            expect(QUERIES.IS_NOT_CURRENT_MONTH.match(value, dataType)).toBe(
              invertedResult,
            );
          },
        );

        const INVALID_CASES = [
          ['not a date', true], // TODO: should be false
          ['', false],
          [null, false],
          [undefined, false],
        ];
        test.each(INVALID_CASES)(
          `when testing %j at ${now} returns %j`,
          (value, result) => {
            expect(QUERIES.IS_NOT_CURRENT_MONTH.match(value, dataType)).toBe(
              result,
            );
          },
        );
      });
    });
  });

  describe('PREVIOUS_MONTH', () => {
    describe('dates', () => {
      const now = new Date('2022-03-04T00:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATE.key;
      const PREVIOUS_MONTH_CASES = [
        ['2022-03-01', false],
        ['2022-03-04', false],
        ['2022-03-31', false],
        ['2022-04-01', false],
        ['2022-02-01', true],
        ['2022-02-28', true],
        ['2021-02-04', false],
        ['2023-02-04', false],
      ];
      const INVALID_CASES = [
        ['not a date', false],
        // TODO: all the following should be false
        ['', true],
        [null, true],
        [undefined, true],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      test.each(PREVIOUS_MONTH_CASES)(
        `when testing %j at ${now} returns %j`,
        (value, result) => {
          expect(QUERIES.IS_PREVIOUS_MONTH.match(value, dataType)).toBe(result);
        },
      );

      test.each(INVALID_CASES)(
        `when testing %j at ${now} returns %j`,
        (value, result) => {
          expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(result);
        },
      );
    });

    describe('datetimes', () => {
      const now = new Date('2022-03-04T00:00:00.000Z');
      const dataType = FIELD_DATA_TYPES.DATE.key;
      const PREVIOUS_MONTH_CASES = [
        ['2022-03-04T00:00:00.000Z', false],
        ['2022-04-01T00:00:00.000Z', false],
        ['2022-02-01T12:00:00.000Z', true], // stay away from time zone boundaries
        ['2022-02-28T12:00:00.000Z', true], // stay away from time zone boundaries
        ['2021-02-04T00:00:00.000Z', false],
        ['2023-02-04T00:00:00.000Z', false],
      ];
      const INVALID_CASES = [
        ['not a date', false],
        // TODO: all the following should be false
        ['', true],
        [null, true],
        [undefined, true],
      ];

      beforeEach(() => {
        nowFn.mockReturnValue(now);
      });

      test.each(PREVIOUS_MONTH_CASES)(
        `when testing %j at ${now} returns %j`,
        (value, result) => {
          expect(QUERIES.IS_PREVIOUS_MONTH.match(value, dataType)).toBe(result);
        },
      );

      test.each(INVALID_CASES)(
        `when testing %j at ${now} returns %j`,
        (value, result) => {
          expect(QUERIES.IS_CURRENT_MONTH.match(value, dataType)).toBe(result);
        },
      );
    });
  });
});
