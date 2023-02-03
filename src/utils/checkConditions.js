import checkCondition from './checkCondition';

export default function checkConditions({card, conditions}) {
  if (!conditions) {
    return true;
  }

  return conditions.every(condition => checkCondition({card, condition}));
}
