import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {large, useBreakpoint} from '../../../breakpoints';
import Button from '../../../components/Button';
import ErrorSnackbar from '../../../components/ErrorSnackbar';
import sharedStyles, {useColumnStyle} from '../../../components/sharedStyles';
import {useCards, useCreateCard, usePrimeCard} from '../../../data/cards';
import {useColumns, useCreateColumn} from '../../../data/columns';
import {useBoardElements} from '../../../data/elements';
import ELEMENT_TYPES from '../../../enums/elementTypes';
import VALUES from '../../../enums/values';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';
import Column from './Column';
import EditColumnForm from './EditColumnForm';

export default function ColumnList({board}) {
  const navigation = useNavigation();
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const {data: elements, isLoading: isLoadingElements} =
    useBoardElements(board);
  const {
    data: columns = [],
    isLoading: isLoadingColumns,
    error: columnsError,
  } = useColumns(board);
  const {isLoading: isLoadingCards} = useCards(board);
  const primeCard = usePrimeCard({board});

  const {
    mutate: createColumn,
    isLoading: isAddingColumn,
    error: createColumnError,
  } = useCreateColumn(board);
  const handleCreateColumn = () =>
    createColumn(null, {
      onSuccess: ({data: column}) => setSelectedColumnId(column.id),
    });

  function onChangeColumn() {
    setSelectedColumnId(null);
  }

  const {
    mutate: createCard,
    isLoading: isAddingCard,
    error: createCardError,
  } = useCreateCard(board);
  const handleCreateCard = () =>
    createCard(
      {'field-values': getInitialFieldValues(elements)},
      {onSuccess: ({data: newCard}) => showDetail(newCard)},
    );

  function showDetail(card) {
    primeCard(card);
    // TODO: may want to make sure card form data does reload if it changes from server

    navigation.navigate('Card', {cardId: card.id});
  }

  const breakpoint = useBreakpoint();
  const responsiveButtonContainerStyle = {
    alignItems: breakpoint === large ? 'flex-start' : 'stretch',
  };
  const columnWidthStyle = useColumnStyle();
  const pagingEnabled = breakpoint !== large;

  const isLoading = isLoadingCards || isLoadingColumns || isLoadingElements;
  if (isLoading) {
    return null; // loading indicator is in header
  }

  const sortedColumns = sortByDisplayOrder(columns);

  return (
    <View style={sharedStyles.fullHeight}>
      <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
        <Button
          mode="link"
          icon="plus"
          onPress={handleCreateCard}
          disabled={isAddingCard}
        >
          Add Card
        </Button>
      </View>
      <ScrollView
        horizontal
        pagingEnabled={pagingEnabled}
        style={sharedStyles.fullHeight}
      >
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
                onSelectCard={card => showDetail(card)}
              />
            );
          }
        })}
        <View style={[columnWidthStyle, sharedStyles.columnPadding]}>
          <View style={responsiveButtonContainerStyle}>
            <Button
              mode="link"
              icon="plus"
              onPress={handleCreateColumn}
              disabled={isAddingColumn}
            >
              Add Column
            </Button>
          </View>
        </View>
      </ScrollView>
      <ErrorSnackbar error={columnsError}>
        An error occurred loading columns.
      </ErrorSnackbar>
      <ErrorSnackbar error={createColumnError}>
        An error occurred adding a column.
      </ErrorSnackbar>
      <ErrorSnackbar error={createCardError}>
        An error occurred adding a card.
      </ErrorSnackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 8,
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
