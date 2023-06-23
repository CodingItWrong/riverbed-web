import sortBy from 'lodash/sortBy';
import fieldTypes from '../../../components/fieldTypes';
import SORT_DIRECTIONS from '../../../enums/sortDirections';

export default function groupCards({columnCards, cardGrouping, elements}) {
  if (!(cardGrouping?.field && cardGrouping?.direction)) {
    if (columnCards.length === 0) {
      return [];
    } else {
      return [{value: null, data: columnCards}];
    }
  }

  const groupField = elements.find(e => e.id === cardGrouping.field);
  const fieldType = fieldTypes[groupField.attributes['data-type']];

  let cardGroups = [];

  columnCards.forEach(card => {
    const groupValue =
      card.attributes['field-values'][cardGrouping.field] ?? null;
    let group = cardGroups.find(g => g.value === groupValue);
    if (!group) {
      group = {value: groupValue, data: []};
      cardGroups.push(group);
    }
    group.data.push(card);
  });

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

  return cardGroups;
}
