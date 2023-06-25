import {ScrollView} from 'react-native';
import {useNavigate} from 'react-router-dom';
import {large, useBreakpoint} from '../../../breakpoints';
import Button from '../../../components/Button';
import ErrorSnackbar from '../../../components/ErrorSnackbar';
import sharedStyles, {useColumnStyle} from '../../../components/sharedStyles';
import {useCards} from '../../../data/cards';
import {useColumns, useCreateColumn} from '../../../data/columns';
import {useBoardElements} from '../../../data/elements';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';
import Column from './Column';

export default function ColumnList({board}) {
  const navigate = useNavigate();

  const {isLoading: isLoadingElements} = useBoardElements(board);
  const {
    data: columns = [],
    isLoading: isLoadingColumns,
    error: columnsError,
  } = useColumns(board);
  const {isLoading: isLoadingCards} = useCards(board);

  const {
    mutate: createColumn,
    isLoading: isAddingColumn,
    error: createColumnError,
  } = useCreateColumn(board);
  const handleCreateColumn = () =>
    createColumn(null, {
      onSuccess: ({data: column}) => navigate(`columns/${column.id}`),
    });

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
      <ScrollView
        horizontal
        pagingEnabled={pagingEnabled}
        style={sharedStyles.fullHeight}
      >
        {sortedColumns.map(column => (
          <Column key={column.id} column={column} board={board} />
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
