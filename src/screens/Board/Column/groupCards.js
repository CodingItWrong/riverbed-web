import sortBy from 'lodash.sortby';
import fieldTypes from '../../../components/fieldTypes';
import SORT_DIRECTIONS from '../../../enums/sortDirections';

export default function groupCards({columnCards, cardGrouping, elements}) {
  let cardGroups;

  const applyGrouping = cardGrouping?.field && cardGrouping?.direction;
  const groupField =
    applyGrouping && elements.find(e => e.id === cardGrouping.field);
  if (applyGrouping) {
    cardGroups = [];
    columnCards.forEach(card => {
      const groupValue = card.attributes['field-values'][cardGrouping.field];
      let group = cardGroups.find(g => g.value === groupValue);
      if (!group) {
        group = {value: groupValue, data: []};
        cardGroups.push(group);
      }
      group.data.push(card);
    });
    const fieldType = fieldTypes[groupField.attributes['data-type']];
    cardGroups = sortBy(cardGroups, [
      group =>
        fieldType.getSortValue({
          value: group.value,
          options: groupField.attributes.options,
        }),
    ]);
    if (cardGrouping.direction === SORT_DIRECTIONS.DESCENDING.key) {
      cardGroups.reverse();
    }
  } else {
    if (columnCards.length === 0) {
      cardGroups = [];
    } else {
      cardGroups = [{value: null, data: columnCards}];
    }
  }

  return cardGroups;
}
