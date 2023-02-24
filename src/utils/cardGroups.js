import sortBy from 'lodash.sortby';
import SORT_DIRECTIONS from '../enums/sortDirections';

export function groupCards(columnCards, cardGrouping) {
  let cardGroups = [];

  const applyGrouping = cardGrouping?.field && cardGrouping?.direction;
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
    cardGroups = sortBy(cardGroups, ['value']);
    if (cardGrouping.direction === SORT_DIRECTIONS.DESCENDING.key) {
      cardGroups.reverse();
    }
  } else {
    // this is to cover the case where there are no groups, but there are some cards
    cardGroups = [{value: null, data: columnCards}];
  }

  cardGroups = columnCards.length ? cardGroups : [];

  return {cardGroups, applyGrouping};
}
