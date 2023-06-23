import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import IconButton from '../../../components/IconButton';
import SectionHeader from '../../../components/SectionHeader';
import SectionList from '../../../components/SectionList';
import Text from '../../../components/Text';
import fieldTypes from '../../../components/fieldTypes';
import sharedStyles, {useColumnStyle} from '../../../components/sharedStyles';
import {useCards} from '../../../data/cards';
import {useBoardElements} from '../../../data/elements';
import SORT_DIRECTIONS from '../../../enums/sortDirections';
import calculateSummary from '../../../utils/calculateSummary';
import checkConditions from '../../../utils/checkConditions';
import CardSummary from './CardSummary';
import groupCards from './groupCards';

export default function Column({column, board, onEdit, onSelectCard}) {
  const columnWidthStyle = useColumnStyle();

  const {data: elements} = useBoardElements(board);
  const {data: cards = []} = useCards(board);

  const {
    name,
    'card-sort-order': cardSortOrder,
    'card-inclusion-conditions': cardInclusionConditions,
    'card-grouping': cardGrouping,
    summary,
  } = column.attributes;

  const filteredCards = cards.filter(card =>
    checkConditions({
      fieldValues: card.attributes['field-values'],
      conditions: cardInclusionConditions,
      elements,
    }),
  );
  let columnCards;

  if (cardSortOrder?.field && cardSortOrder?.direction) {
    const sortField = elements.find(e => e.id === cardSortOrder.field);
    const fieldType = fieldTypes[sortField.attributes['data-type']];
    columnCards = sortBy(filteredCards, [
      card =>
        fieldType.getSortValue({
          value: get(card, `attributes.field-values.${cardSortOrder.field}`),
          options: sortField.attributes.options,
        }),
    ]);
    if (cardSortOrder?.direction === SORT_DIRECTIONS.DESCENDING.key) {
      columnCards.reverse();
    }
  } else {
    columnCards = filteredCards;
  }

  const applyGrouping = cardGrouping?.field && cardGrouping?.direction;
  const groupField =
    applyGrouping && elements.find(e => e.id === cardGrouping.field);
  const cardGroups = groupCards({columnCards, cardGrouping, elements});

  return (
    <div
      key={column.id}
      data-testid={`column-${column.id}`}
      style={{
        ...columnWidthStyle,
        ...styles.columnWrapper,
        ...sharedStyles.column,
      }}
    >
      <div
        style={{
          ...sharedStyles.row,
          ...sharedStyles.columnPadding,
          ...styles.columnHeader,
        }}
      >
        <Text size={2} testID="column-name">
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
      </div>
      <SectionList
        sections={cardGroups}
        sectionKeyExtractor={group => group.value}
        itemKeyExtractor={card => card.id}
        contentContainerStyle={sharedStyles.columnPadding}
        ListEmptyComponent={<Text size={3}>(no cards)</Text>}
        renderSectionHeader={({section: group}) => {
          if (!applyGrouping) {
            return;
          }

          const fieldType = fieldTypes[groupField.attributes['data-type']];
          let textToShow =
            fieldType.formatValue({
              value: group.value,
              options: groupField.attributes.options,
            }) ?? '(empty)';

          if (groupField?.attributes.options['show-label-when-read-only']) {
            textToShow = `${groupField.attributes.name}: ${textToShow}`;
          }

          return (
            <SectionHeader testID="group-heading">{textToShow}</SectionHeader>
          );
        }}
        renderItem={({item: card, section: group}) => (
          <div
            data-testid={
              cardGrouping && `group-${cardGrouping.field}-${group.value}-card`
            }
          >
            <CardSummary
              card={card}
              board={board}
              elements={elements}
              onPress={() => onSelectCard(card)}
              style={sharedStyles.mb}
            />
          </div>
        )}
      />
    </div>
  );
}

const styles = {
  columnWrapper: {
    padding: 0, // overrides previous padding style
    minHeight: 0, // needed so that the column scrolls on mobile, no idea why
  },
  columnHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
};
