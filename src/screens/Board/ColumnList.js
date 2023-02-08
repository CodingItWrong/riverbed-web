import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import get from 'lodash.get';
import sortBy from 'lodash.sortby';
import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {large, useBreakpoint} from '../../breakpoints';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import SORT_DIRECTIONS from '../../enums/sortDirections';
import VALUES from '../../enums/values';
import checkConditions from '../../utils/checkConditions';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';
import CardDetail from './CardDetail';
import CardSummary from './CardSummary';
import EditColumnForm from './EditColumnForm';

export default function ColumnList({board}) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const columnClient = useColumns();
  const cardClient = useCards();

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const {data: elements, isLoading: isLoadingElements} = useQuery(
    ['elements', board.id],
    () => elementClient.related({parent: board}).then(resp => resp.data),
  );
  const {data: columns = [], isLoading: isLoadingColumns} = useQuery(
    ['columns', board.id],
    () => columnClient.related({parent: board}).then(resp => resp.data),
  );
  const {data: cards = [], isLoading: isLoadingCards} = useQuery(
    ['cards', board.id],
    () => cardClient.related({parent: board}).then(resp => resp.data),
  );

  const refreshCards = () => queryClient.invalidateQueries(['cards', board.id]);
  const refreshColumns = () =>
    queryClient.invalidateQueries(['columns', board.id]);

  const {mutate: addColumn, isLoading: isAddingColumn} = useMutation({
    mutationFn: () =>
      columnClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes: {},
      }),
    onSuccess: ({data: column}) => {
      setSelectedColumnId(column.id);
      refreshColumns();
    },
  });

  function onChangeColumn() {
    refreshColumns();
    setSelectedColumnId(null);
  }

  const {mutate: addCard, isLoading: isAddingCard} = useMutation({
    mutationFn: () => {
      const fieldValues = Object.fromEntries(
        elements
          .filter(
            e =>
              e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key &&
              e.attributes['initial-value'] !== null,
          )
          .map(e => {
            const {'data-type': dataType, 'initial-value': initialValue} =
              e.attributes;
            const resolvedValue = Object.values(VALUES)
              .find(v => v.key === initialValue)
              ?.call(dataType);
            return [e.id, resolvedValue];
          }),
      );
      return cardClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes: {'field-values': fieldValues},
      });
    },
    onSuccess: ({data: newCard}) => {
      setSelectedCardId(newCard.id);
      refreshCards();
    },
  });

  function onChangeCard() {
    refreshCards();
    hideDetail();
  }

  function showDetail(cardId) {
    setSelectedCardId(cardId);
  }

  function hideDetail() {
    setSelectedCardId(null);
  }

  const breakpoint = useBreakpoint();
  const responsiveButtonContainerStyle = {
    alignItems: breakpoint === large ? 'flex-start' : 'stretch',
  };
  const columnWidthStyle = useColumnStyle();

  const isLoading = isLoadingCards || isLoadingColumns || isLoadingElements;
  if (isLoading) {
    return (
      <View style={columnWidthStyle}>
        <LoadingIndicator />
      </View>
    );
  }

  const sortedColumns = sortByDisplayOrder(columns);

  return (
    <View style={sharedStyles.fullHeight}>
      <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
        <Button onPress={addCard} disabled={isAddingCard}>
          Add Card
        </Button>
      </View>
      <ScrollView horizontal pagingEnabled style={sharedStyles.fullHeight}>
        {sortedColumns.map((column, columnIndex) => {
          if (selectedColumnId === column.id) {
            return (
              <EditColumnForm
                key={column.id}
                column={column}
                board={board}
                onChange={onChangeColumn}
                onCancel={() => setSelectedColumnId(null)}
                style={columnWidthStyle}
              />
            );
          } else {
            const {
              name,
              'card-sort-order': cardSortOrder,
              'card-inclusion-conditions': cardInclusionConditions,
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
                c =>
                  get(
                    c,
                    `attributes.field-values.${cardSortOrder.field}`,
                  )?.trim(),
              ]);
              if (cardSortOrder?.direction === SORT_DIRECTIONS.DESCENDING.key) {
                columnCards.reverse();
              }
            } else {
              columnCards = filteredCards;
            }

            return (
              <View
                key={column.id}
                testID={`column-${column.id}`}
                style={[
                  columnWidthStyle,
                  sharedStyles.fullHeight,
                  styles.columnWrapper,
                ]}
              >
                <View style={[sharedStyles.row, sharedStyles.columnPadding]}>
                  <Text variant="titleLarge" testID="column-name">
                    {name ?? '(unnamed column)'} ({columnCards.length})
                  </Text>
                  <IconButton
                    icon="pencil"
                    onPress={() => setSelectedColumnId(column.id)}
                    accessibilityLabel="Edit Column"
                  />
                </View>
                <KeyboardAwareFlatList
                  extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
                  data={columnCards}
                  keyExtractor={card => card.id}
                  contentContainerStyle={[
                    sharedStyles.columnPadding,
                    {paddingBottom: insets.bottom},
                  ]}
                  scrollIndicatorInsets={{bottom: insets.bottom}}
                  renderItem={({item: card}) => {
                    if (selectedCardId === card.id) {
                      return (
                        <CardDetail
                          card={card}
                          board={board}
                          onChange={onChangeCard}
                          onCancel={hideDetail}
                          style={sharedStyles.mb}
                        />
                      );
                    } else {
                      return (
                        <CardSummary
                          card={card}
                          board={board}
                          onPress={() => showDetail(card.id)}
                          style={sharedStyles.mb}
                        />
                      );
                    }
                  }}
                />
              </View>
            );
          }
        })}
        <View style={[columnWidthStyle, sharedStyles.columnPadding]}>
          <View style={responsiveButtonContainerStyle}>
            <Button onPress={addColumn} disabled={isAddingColumn}>
              Add Column
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Just guessed a value and it worked. Might be due to Add/title rows
const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 180;

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 8,
  },
  spacer: {
    flex: 1,
  },
  columnWrapper: {
    padding: 0, // no idea why this is needed. does View have default padding?
  },
});
