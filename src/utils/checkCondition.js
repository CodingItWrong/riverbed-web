import QUERIES from '../enums/queries';

export default function checkCondition({card, condition}) {
  if (!condition) {
    return true;
  }

  const value = card.attributes['field-values'][condition.field];
  switch (condition.query) {
    case QUERIES.IS_EMPTY.key:
      return !value;
    case QUERIES.IS_NOT_EMPTY.key:
      return !!value;
    default:
      console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
