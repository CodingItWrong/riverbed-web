import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {large, useBreakpoint} from '../../breakpoints';
import Button from '../../components/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';
import Column from './Column';
import EditColumnForm from './EditColumnForm';

export default function ColumnList({board}) {
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
  const {isLoading: isLoadingCards} = useQuery(['cards', board.id], () =>
    cardClient.related({parent: board}).then(resp => resp.data),
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
        attributes: {
          'field-values': getInitialFieldValues(elements),
        },
        relationships: {
          board: {data: {type: 'boards', id: board.id}},
        },
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
            return (
              <Column
                key={column.id}
                column={column}
                board={board}
                onEdit={() => setSelectedColumnId(column.id)}
                selectedCardId={selectedCardId}
                onSelectCard={card => showDetail(card.id)}
                onChangeCard={onChangeCard}
                onCancelEdit={hideDetail}
              />
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

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 8,
  },
  spacer: {
    flex: 1,
  },
});

function getInitialFieldValues(elements) {
  const fieldsWithInitialValues = elements.filter(
    e =>
      e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key &&
      e.attributes['initial-value'] !== null,
  );
  const initialValueEntries = fieldsWithInitialValues.map(field => {
    const {'data-type': dataType, 'initial-value': initialValue} =
      field.attributes;
    const resolvedValue = Object.values(VALUES)
      .find(v => v.key === initialValue)
      ?.call(dataType);
    return [field.id, resolvedValue];
  });
  return Object.fromEntries(initialValueEntries);
}
