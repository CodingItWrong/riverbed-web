import QUERIES from '../enums/queries';

export default function checkConditions({card, conditions, elements}) {
  if (!conditions) {
    return true;
  }

  return conditions.every(condition =>
    checkCondition({card, condition, elements}),
  );
}

function checkCondition({card, condition, elements}) {
  const {field, query} = condition ?? {};
  if (!field || !query) {
    return true;
  }

  const fieldObject = elements.find(e => e.id === condition.field);
  const dataType = fieldObject.attributes['data-type'];
  const value = card.attributes['field-values'][condition.field];
  const queryObject = QUERIES[condition.query];
  if (queryObject) {
    return queryObject.match(value, dataType);
  } else {
    console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
