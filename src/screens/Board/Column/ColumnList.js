import {useIsFetching} from '@tanstack/react-query';
import {memo} from 'react';
import {ScrollView} from 'react-native';
import {useNavigate} from 'react-router-dom';

import {large, useBreakpoint} from '../../../breakpoints';
import Button from '../../../components/Button';
import ErrorSnackbar from '../../../components/ErrorSnackbar';
import LoadingIndicator from '../../../components/LoadingIndicator';
import sharedStyles, {useColumnStyle} from '../../../components/sharedStyles';
import {useColumns, useCreateColumn} from '../../../data/columns';
import {useBoardElements} from '../../../data/elements';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';
import Column from './Column';

function ColumnList({board, isLoadingBoard}) {
  const {isLoading: isLoadingElements, isFetching: isFetchingElements} =
    useBoardElements(board);
  const {
    data: columns = [],
    isLoading: isLoadingColumns,
    isFetching: isFetchingColumns,
    error: columnsError,
  } = useColumns(board);
  const isFetchingCards = useIsFetching({queryKey: ['columnCards']}) > 0;

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

  const isLoading = board
    ? isLoadingColumns || isLoadingElements
    : isLoadingBoard;
  const isFetching = isFetchingCards || isFetchingColumns || isFetchingElements;
  if (isLoading) {
    return (
      <div style={sharedStyles.firstLoadIndicatorContainer}>
        <LoadingIndicator style={styles.firstLoadIndicator} />
      </div>
    );
  }

  const sortedColumns = sortByDisplayOrder(columns);

  return (
    <div
      data-testid="outer"
      style={{...sharedStyles.column, ...styles.containerHeight}}
    >
      {isFetching && <LoadingIndicator style={styles.reloadIndicator} />}
      <ScrollView
        horizontal
        pagingEnabled={pagingEnabled}
        style={sharedStyles.fullHeight}
      >
        {sortedColumns.map(column => (
          <Column key={column.id} column={column} board={board} />
        ))}
        {board && (
          <div style={{...columnWidthStyle, ...sharedStyles.columnPadding}}>
            <div style={fullContainerStyle}>
              <AddColumnButton board={board} />
            </div>
          </div>
        )}
      </ScrollView>
      <ErrorSnackbar error={columnsError}>
        An error occurred loading columns.
      </ErrorSnackbar>
    </div>
  );
}

export default memo(ColumnList);

// Kept separate so that ColumnList does not call useNavigate, which would
// rerender every column whenever the route changes (e.g. opening a card)
function AddColumnButton({board}) {
  const navigate = useNavigate();
  const {
    mutate: createColumn,
    isLoading: isAddingColumn,
    error: createColumnError,
  } = useCreateColumn(board);
  const handleCreateColumn = () =>
    createColumn(null, {
      onSuccess: ({data: column}) => navigate(`columns/${column.id}`),
    });

  return (
    <>
      <Button
        mode="link"
        icon="plus"
        onPress={handleCreateColumn}
        disabled={isAddingColumn}
      >
        Add Column
      </Button>
      <ErrorSnackbar error={createColumnError}>
        An error occurred adding a column.
      </ErrorSnackbar>
    </>
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
  reloadIndicator: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    width: '20px',
    height: '20px',
  },
};
