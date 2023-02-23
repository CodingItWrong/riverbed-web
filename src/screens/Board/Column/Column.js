import {useQuery} from '@tanstack/react-query';
import get from 'lodash.get';
import sortBy from 'lodash.sortby';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareSectionList} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconButton from '../../../components/IconButton';
import SectionHeader from '../../../components/SectionHeader';
import Text from '../../../components/Text';
import sharedStyles, {useColumnStyle} from '../../../components/sharedStyles';
import {useCardClient} from '../../../data/cards';
import {useBoardElements} from '../../../data/elements';
import SORT_DIRECTIONS from '../../../enums/sortDirections';
import calculateSummary from '../../../utils/calculateSummary';
import checkConditions from '../../../utils/checkConditions';
import formatValue from '../../../utils/formatValue';
import getSortValue from '../../../utils/getSortValue';
import CardDetail from '../Card/CardDetail';
import CardSummary from '../Card/CardSummary';

export default function Column({
  column,
  board,
  onEdit,
  onCancelEdit,
  selectedCardId,
  onSelectCard,
  onChangeCard,
}) {
  const insets = useSafeAreaInsets();
  const columnWidthStyle = useColumnStyle();
  const cardClient = useCardClient();

  const {data: elements} = useBoardElements(board);
  const {data: cards = []} = useQuery(['cards', board.id], () =>
    cardClient.related({parent: board}).then(resp => resp.data),
  );

  const {
    name,
    'card-sort-order': cardSortOrder,
    'card-inclusion-conditions': cardInclusionConditions,
    'card-grouping': cardGrouping,
    summary,
  } = column.attributes;

  const filteredCards = cards.filter(card =>
    checkConditions({
      card,
      conditions: cardInclusionConditions,
      elements,
    }),
  );
  let columnCards;

  if (cardSortOrder?.field && cardSortOrder?.direction) {
    const sortField = elements.find(e => e.id === cardSortOrder.field);
    columnCards = sortBy(filteredCards, [
      card =>
        getSortValue({
          value: get(card, `attributes.field-values.${cardSortOrder.field}`),
          dataType: sortField.attributes['data-type'],
          options: sortField.attributes.options,
        }),
    ]);
    if (cardSortOrder?.direction === SORT_DIRECTIONS.DESCENDING.key) {
      columnCards.reverse();
    }
  } else {
    columnCards = filteredCards;
  }

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
    cardGroups = sortBy(cardGroups, [
      group =>
        getSortValue({
          value: group.value,
          dataType: groupField.attributes['data-type'],
          options: groupField.attributes.options,
        }),
    ]);
    if (cardGrouping.direction === SORT_DIRECTIONS.DESCENDING.key) {
      cardGroups.reverse();
    }
  } else {
    cardGroups = [{value: null, data: columnCards}];
  }

  return (
    <View
      key={column.id}
      testID={`column-${column.id}`}
      style={[columnWidthStyle, sharedStyles.fullHeight, styles.columnWrapper]}
    >
      <View style={[sharedStyles.row, sharedStyles.columnPadding]}>
        <Text variant="titleMedium" testID="column-name">
          {name ?? '(unnamed column)'}
          {summary?.function && (
            <> ({calculateSummary({cards: columnCards, summary})})</>
          )}
        </Text>
        <IconButton
          icon="pencil"
          onPress={onEdit}
          accessibilityLabel="Edit Column"
        />
      </View>
      <KeyboardAwareSectionList
        extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
        sections={cardGroups}
        keyExtractor={card => card.id}
        contentContainerStyle={[
          sharedStyles.columnPadding,
          {paddingBottom: insets.bottom},
        ]}
        scrollIndicatorInsets={{bottom: insets.bottom}}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: group}) => {
          if (!applyGrouping) {
            return;
          }

          let textToShow =
            formatValue({
              value: group.value,
              dataType: groupField.attributes['data-type'],
              options: groupField.attributes.options,
            }) ?? '(empty)';

          if (groupField?.attributes.options['show-label-when-read-only']) {
            textToShow = `${groupField.attributes.name}: ${textToShow}`;
          }

          return (
            <SectionHeader testID="group-heading">{textToShow}</SectionHeader>
          );
        }}
        renderItem={({item: card, section: group}) => {
          if (selectedCardId === card.id) {
            return (
              <CardDetail
                card={card}
                board={board}
                onChange={onChangeCard}
                onCancel={onCancelEdit}
                style={sharedStyles.mb}
              />
            );
          } else {
            return (
              <View
                testID={
                  cardGrouping &&
                  `group-${cardGrouping.field}-${group.value}-card`
                }
              >
                <CardSummary
                  card={card}
                  board={board}
                  onPress={() => onSelectCard(card)}
                  style={sharedStyles.mb}
                />
              </View>
            );
          }
        }}
      />
    </View>
  );
}

// Just guessed a value and it worked. Might be due to Add/title rows
const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 180;

const styles = StyleSheet.create({
  columnWrapper: {
    padding: 0, // no idea why this is needed. does View have default padding?
  },
});
