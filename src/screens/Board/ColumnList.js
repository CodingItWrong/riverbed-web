import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import {useState} from 'react';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import SORT_DIRECTIONS from '../../enums/sortDirections';
import checkCondition from '../../utils/checkCondition';
import CardDetail from './CardDetail';
import CardSummary from './CardSummary';
import EditColumnForm from './EditColumnForm';

export default function ColumnList({board}) {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const columnClient = useColumns();
  const cardClient = useCards();

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const {data: columns = []} = useQuery(['columns', board.id], () =>
    columnClient.related({parent: board}).then(resp => resp.data),
  );
  const {data: cards = []} = useQuery(['cards', board.id], () =>
    cardClient.related({parent: board}).then(resp => resp.data),
  );

  const refreshCards = () => queryClient.invalidateQueries(['cards', board.id]);
  const refreshColumns = () =>
    queryClient.invalidateQueries(['columns', board.id]);

  const {mutate: addColumn} = useMutation({
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

  const {mutate: updateColumn} = useMutation({
    mutationFn: attributes => {
      const updatedColumn = {
        type: 'columns',
        id: selectedColumnId,
        attributes,
      };
      return columnClient.update(updatedColumn);
    },
    onSuccess: () => {
      refreshColumns();
      setSelectedColumnId(null);
    },
  });

  const {mutate: deleteColumn} = useMutation({
    mutationFn: () => columnClient.delete({id: selectedColumnId}),
    onSuccess: () => {
      refreshColumns();
      setSelectedColumnId(null);
    },
  });

  const {mutate: addCard} = useMutation({
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

  const {mutate: updateCard} = useMutation({
    mutationFn: fieldValues => {
      const updatedCard = {
        type: 'cards',
        id: selectedCardId,
        attributes: {'field-values': fieldValues},
      };
      return cardClient.update(updatedCard);
    },
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  const {mutate: deleteCard} = useMutation({
    mutationFn: () => cardClient.delete({id: selectedCardId}),
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  function showDetail(cardId) {
    setSelectedCardId(cardId);
  }

  function hideDetail() {
    setSelectedCardId(null);
  }

  const {width: viewportWidth} = useWindowDimensions();
  const largeBreakpoint = 600;
  const responsiveColumnStyle = {
    width: viewportWidth > largeBreakpoint ? 400 : viewportWidth,
    padding: 8,
  };
  const responsiveButtonContainerStyle = {
    alignItems: viewportWidth > largeBreakpoint ? 'flex-start' : 'stretch',
  };

  if (!cards || !elements || !columns) {
    return <LoadingIndicator />;
  }

  return (
    <View style={sharedStyles.fullHeight}>
      <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
        <Button onPress={addCard}>Add Card</Button>
      </View>
      <ScrollView horizontal style={sharedStyles.fullHeight}>
        {columns.map(column => {
          if (selectedColumnId === column.id) {
            return (
              <EditColumnForm
                key={column.id}
                column={column}
                board={board}
                onSave={updateColumn}
                onDelete={deleteColumn}
                onCancel={() => setSelectedColumnId(null)}
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

            return (
              <View
                key={column.id}
                testID={`column-${column.id}`}
                style={[responsiveColumnStyle, sharedStyles.fullHeight]}
              >
                <View style={sharedStyles.row}>
                  <Text variant="titleLarge">{name ?? '(unnamed column)'}</Text>
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
                  renderItem={({item: card}) => {
                    if (selectedCardId === card.id) {
                      return (
                        <CardDetail
                          card={card}
                          board={board}
                          onUpdate={updateCard}
                          onDelete={deleteCard}
                          onCancel={hideDetail}
                        />
                      );
                    } else {
                      return (
                        <CardSummary
                          card={card}
                          board={board}
                          onPress={() => showDetail(card.id)}
                        />
                      );
                    }
                  }}
                />
              </View>
            );
          }
        })}
        <View>
          <Button onPress={addColumn}>Add Column</Button>
        </View>
      </ScrollView>
    </View>
  );
}

// Just guessed a value and it worked. Might be due to Add/title rows
const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 100;

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 8,
  },
});
