export function groupCards(columnCards, cardGrouping, elements) {
  let cardGroups = [];

  const applyGrouping = cardGrouping?.field && cardGrouping?.direction;
  const groupFieldDataType =
    applyGrouping &&
    elements.find(e => e.id === cardGrouping.field).attributes['data-type'];
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
    cardGroups = [{value: null, data: columnCards}];
  }

  return {cardGroups, groupFieldDataType, applyGrouping};
}
