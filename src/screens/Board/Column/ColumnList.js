import {ScrollView} from 'react-native';
import {useNavigate} from 'react-router-dom';
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

export default function ColumnList({board}) {
  const navigate = useNavigate();

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
      onSuccess: ({data: column}) => showColumn(column),
    });

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

  function showColumn(column) {
    navigate(`columns/${column.id}`);
  }

  function showDetail(card) {
    primeCard(card);
    // TODO: may want to make sure card form data does reload if it changes from server

    navigate(`cards/${card.id}`);
  }

  const breakpoint = useBreakpoint();
  const responsiveButtonContainerStyle = {
    alignItems: breakpoint === large ? 'flex-start' : 'stretch',
  };
  const fullContainerStyle = {
    ...sharedStyles.column,
    ...styles.buttonContainer,
    ...responsiveButtonContainerStyle,
  };
  const columnWidthStyle = useColumnStyle();
  const pagingEnabled = breakpoint !== large;

  const isLoading = isLoadingCards || isLoadingColumns || isLoadingElements;
  if (isLoading) {
    return null; // loading indicator is in header
  }

  const sortedColumns = sortByDisplayOrder(columns);

  return (
    <div
      data-testid="outer"
      style={{...sharedStyles.column, ...styles.containerHeight}}
    >
      <div style={fullContainerStyle}>
        <Button
          mode="link"
          icon="plus"
          onPress={handleCreateCard}
          disabled={isAddingCard}
        >
          Add Card
        </Button>
      </div>
      <ScrollView
        horizontal
        pagingEnabled={pagingEnabled}
        style={sharedStyles.fullHeight}
      >
        {sortedColumns.map(column => (
          <Column
            key={column.id}
            column={column}
            board={board}
            onEdit={() => showColumn(column)}
            onSelectCard={card => showDetail(card)}
          />
        ))}
        <div style={{...columnWidthStyle, ...sharedStyles.columnPadding}}>
          <div style={fullContainerStyle}>
            <Button
              mode="link"
              icon="plus"
              onPress={handleCreateColumn}
              disabled={isAddingColumn}
            >
              Add Column
            </Button>
          </div>
        </div>
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
    </div>
  );
}

const styles = {
  containerHeight: {
    position: 'absolute',
    inset: 0,
  },
  buttonContainer: {
    margin: 8,
  },
};

function getInitialFieldValues(elements) {
  const fieldsWithInitialValues = elements.filter(
    e =>
      e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key &&
      e.attributes['initial-value'] !== null,
  );
  const initialValueEntries = fieldsWithInitialValues.map(field => {
    const {
      'data-type': dataType,
      'initial-value': initialValue,
      options: elementOptions,
    } = field.attributes;
    const resolvedValue = Object.values(VALUES)
      .find(v => v.key === initialValue)
      ?.call(dataType, elementOptions);
    return [field.id, resolvedValue];
  });
  return Object.fromEntries(initialValueEntries);
}
