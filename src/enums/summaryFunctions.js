const SUMMARY_FUNCTIONS = {
  COUNT: {
    key: 'COUNT',
    label: 'Count',
    call: cards => cards.length,
  },
  SUM: {
    key: 'SUM',
    label: 'Sum',
    call: (cards, options) =>
      cards
        .map(card => Number(card.attributes['field-values'][options.field]))
        .filter(value => !Number.isNaN(value))
        .reduce((a, v) => a + v, 0),
  },
};

export default SUMMARY_FUNCTIONS;
