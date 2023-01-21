import QUERIES from '../enums/queries';

export default function checkCondition({card, condition}) {
  if (!condition) {
    return true;
  }

  const value = card.attributes['field-values'][condition.field];
  const query = QUERIES[condition.query];
  if (query) {
    return query.match(value);
  } else {
    console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
