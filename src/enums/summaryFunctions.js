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
        .map(card => card.attributes['field-values'][options.field])
        .reduce((a, v) => a + v),
  },
};

export default SUMMARY_FUNCTIONS;
