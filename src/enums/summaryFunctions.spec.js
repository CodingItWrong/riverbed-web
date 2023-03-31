import SUMMARY_FUNCTIONS from './summaryFunctions';

describe('summaryFunctions', () => {
  const FIELD_ID = '27';

  function cardWithFieldValue(value) {
    return {attributes: {'field-values': {[FIELD_ID]: value}}};
  }

  describe('COUNT', () => {
    it('returns the number of cards', () => {
      const cards = [{}, {}, {}];
      expect(SUMMARY_FUNCTIONS.COUNT.call(cards)).toEqual(3);
    });

    it('returns zero when there are no cards', () => {
      const cards = [];
      expect(SUMMARY_FUNCTIONS.COUNT.call(cards)).toEqual(0);
    });
  });

  describe('SUM', () => {
    it('returns the sum of a numeric field', () => {
      const cards = [
        cardWithFieldValue(1),
        cardWithFieldValue(2),
        cardWithFieldValue(3),
      ];
      expect(SUMMARY_FUNCTIONS.SUM.call(cards, {field: FIELD_ID})).toEqual(6);
    });

    it('returns zero when there are no cards', () => {
      const cards = [];
      expect(SUMMARY_FUNCTIONS.SUM.call(cards, {field: FIELD_ID})).toEqual(0);
    });

    it('converts strings to numbers for summing', () => {
      const cards = [
        cardWithFieldValue('1'),
        cardWithFieldValue('2'),
        cardWithFieldValue('3'),
      ];
      expect(SUMMARY_FUNCTIONS.SUM.call(cards, {field: FIELD_ID})).toEqual(6);
    });

    it('skips non-numeric strings', () => {
      const cards = [
        cardWithFieldValue('1'),
        cardWithFieldValue('lots'),
        cardWithFieldValue('3'),
      ];
      expect(SUMMARY_FUNCTIONS.SUM.call(cards, {field: FIELD_ID})).toEqual(4);
    });
  });
});
