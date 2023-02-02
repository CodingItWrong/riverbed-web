import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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
import SORT_DIRECTIONS from '../../enums/sortDirections';
import checkCondition from '../../utils/checkCondition';
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

  const {isLoading: isLoadingElements} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
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
    mutationFn: () =>
      cardClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes: {},
      }),
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

  return (
    <View style={sharedStyles.fullHeight}>
      <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
        <Button onPress={addCard} disabled={isAddingCard}>
          Add Card
        </Button>
      </View>
      <ScrollView horizontal pagingEnabled style={sharedStyles.fullHeight}>
        {columns.map((column, columnIndex) => {
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
              'card-inclusion-condition': cardInclusionCondition,
            } = column.attributes;

            const filteredCards = cards.filter(card =>
              checkCondition({card, condition: cardInclusionCondition}),
            );
            let columnCards;

            if (cardSortOrder?.field && cardSortOrder?.direction) {
              columnCards = sortBy(filteredCards, [
                `attributes.field-values.${cardSortOrder.field}`,
              ]);
              if (cardSortOrder?.direction === SORT_DIRECTIONS.DESCENDING.key) {
                columnCards.reverse();
              }
            } else {
              columnCards = filteredCards;
            }

            const isLastColumn = columnIndex === columns.length - 1;

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
                <View style={[sharedStyles.row, styles.columnPadding]}>
                  <Text variant="titleLarge">
                    {name ?? '(unnamed column)'} ({columnCards.length})
                  </Text>
                  <IconButton
                    icon="pencil"
                    onPress={() => setSelectedColumnId(column.id)}
                    accessibilityLabel="Edit Column"
                  />
                  {isLastColumn && (
                    <>
                      <View style={styles.spacer} />
                      <IconButton
                        icon="plus"
                        accessibilityLabel="Add Column"
                        disabled={isAddingColumn}
                        onPress={addColumn}
                      />
                    </>
                  )}
                </View>
                <KeyboardAwareFlatList
                  extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
                  data={columnCards}
                  keyExtractor={card => card.id}
                  contentContainerStyle={[
                    styles.columnPadding,
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
                          style={sharedStyles.mt}
                        />
                      );
                    } else {
                      return (
                        <CardSummary
                          card={card}
                          board={board}
                          onPress={() => showDetail(card.id)}
                          style={sharedStyles.mt}
                        />
                      );
                    }
                  }}
                />
              </View>
            );
          }
        })}
        {columns.length === 0 && (
          <IconButton
            icon="plus"
            accessibilityLabel="Add Column"
            onPress={addColumn}
            disabled={isAddingColumn}
          />
        )}
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
  columnPadding: {
    paddingHorizontal: 8,
  },
});
