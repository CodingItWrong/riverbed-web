import QUERIES from '../enums/queries';

export default function checkCondition({card, condition}) {
  const {field, query} = condition ?? {};
  if (!field || !query) {
    return true;
  }

  const value = card.attributes['field-values'][condition.field];
  const queryObject = QUERIES[condition.query];
  if (queryObject) {
    return queryObject.match(value);
  } else {
    console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
