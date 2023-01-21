import QUERIES from '../queries';

export default function checkCondition({card, condition}) {
  if (!condition) {
    return true;
  }

  const value = card.attributes['field-values'][condition.field];
  switch (condition.query) {
    case QUERIES.IS_EMPTY:
      return !value;
    case QUERIES.IS_NOT_EMPTY:
      return !!value;
    default:
      console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
