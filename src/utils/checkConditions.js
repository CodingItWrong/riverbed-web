import QUERIES from '../enums/queries';

export default function checkConditions({fieldValues, conditions, elements}) {
  if (!conditions) {
    return true;
  }

  return conditions.every(condition =>
    checkCondition({fieldValues, condition, elements}),
  );
}

function checkCondition({fieldValues, condition, elements}) {
  const {field, query} = condition ?? {};
  if (!field || !query) {
    return true;
  }

  const fieldObject = elements.find(e => e.id === condition.field);
  const dataType = fieldObject.attributes['data-type'];
  const value = fieldValues[condition.field];
  const queryObject = QUERIES[condition.query];
  if (queryObject) {
    return queryObject.match(value, dataType, condition.options);
  } else {
    console.error(`unrecognized query for condition: ${condition.query}`);
  }
}
