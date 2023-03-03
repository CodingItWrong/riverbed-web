import {useQuery} from '@tanstack/react-query';
import get from 'lodash.get';
import sortBy from 'lodash.sortby';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareSectionList} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconButton from '../../components/IconButton';
import SectionHeader from '../../components/SectionHeader';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useCards} from '../../data/cards';
import {useElements} from '../../data/elements';
import SORT_DIRECTIONS from '../../enums/sortDirections';
import {groupCards} from '../../utils/cardGroups';
import checkConditions from '../../utils/checkConditions';
import formatValue from '../../utils/formatValue';
import CardDetail from './CardDetail';
import CardSummary from './CardSummary';

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
  const elementClient = useElements();
  const cardClient = useCards();

  const {data: elements} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const {data: cards = []} = useQuery(['cards', board.id], () =>
    cardClient.related({parent: board}).then(resp => resp.data),
  );

  const {
    name,
    'card-sort-order': cardSortOrder,
    'card-inclusion-conditions': cardInclusionConditions,
    'card-grouping': cardGrouping,
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
    columnCards = sortBy(filteredCards, [
      c => get(c, `attributes.field-values.${cardSortOrder.field}`)?.trim(),
    ]);
    if (cardSortOrder?.direction === SORT_DIRECTIONS.DESCENDING.key) {
      columnCards.reverse();
    }
  } else {
    columnCards = filteredCards;
  }

  const cardGroups = groupCards(columnCards, cardGrouping);

  // TODO: calculation duplicated in groupCards()
  const applyGrouping = cardGrouping?.field && cardGrouping?.direction;

  const groupFieldDataType =
    applyGrouping &&
    elements.find(e => e.id === cardGrouping.field).attributes['data-type'];

  return (
    <View
      key={column.id}
      testID={`column-${column.id}`}
      style={[columnWidthStyle, sharedStyles.fullHeight, styles.columnWrapper]}
    >
      <View style={[sharedStyles.row, sharedStyles.columnPadding]}>
        <Text variant="titleMedium" testID="column-name">
          {name ?? '(unnamed column)'} ({columnCards.length})
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
        renderSectionHeader={({section: group}) =>
          applyGrouping && (
            <SectionHeader testID="group-heading">
              {group.value
                ? formatValue({
                    value: group.value,
                    dataType: groupFieldDataType,
                  })
                : '(empty)'}
            </SectionHeader>
          )
        }
        ListEmptyComponent={
          <View>
            <Text>(no cards)</Text>
          </View>
        }
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
