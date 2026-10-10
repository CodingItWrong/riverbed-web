import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useIsFetching} from '@tanstack/react-query';
import {useEffect, useMemo} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';

import ErrorSnackbar from '../../components/ErrorSnackbar';
import IconButton from '../../components/IconButton';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCreateCard, usePrimeCard} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useBoardElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import ColumnList from './Column/ColumnList';

export default function Board() {
  const navigate = useNavigate();
  const {boardId} = useParams();
  const {
    data: board,
    isLoading: isLoadingBoard,
    error: boardError,
    refetch: refetchBoard,
  } = useBoard(boardId);

  // Columns and elements are requested by board ID, which is already in the
  // URL, so request them alongside the board instead of after it loads
  const boardRef = useMemo(() => ({type: 'boards', id: boardId}), [boardId]);

  const isFetchingCards = useIsFetching({queryKey: ['columnCards']}) > 0;
  const {
    isFetching: isFetchingColumns,
    error: columnsError,
    refetch: refetchColumns,
  } = useColumns(boardRef);
  const {
    isFetching: isFetchingElements,
    error: elementsError,
    refetch: refetchElements,
  } = useBoardElements(boardRef);
  const isFetching = isFetchingCards || isFetchingColumns || isFetchingElements;
  const error = boardError ?? columnsError ?? elementsError;
  function refetch() {
    refetchBoard();
    refetchColumns();
    refetchElements();
  }

  const {data: elements} = useBoardElements(boardRef);
  const primeCard = usePrimeCard({board});
  const {
    mutate: createCard,
    isLoading: isAddingCard,
    error: createCardError,
  } = useCreateCard(board);
  const handleCreateCard = () =>
    createCard(
      {'field-values': getInitialFieldValues(elements)},
      {
        onSuccess: ({data: newCard}) => {
          primeCard(newCard);
          navigate(`cards/${newCard.id}`);
        },
      },
    );

  let navigationOptions = (() => {
    if (isLoadingBoard) {
      return {
        title: null,
        icon: null,
        titleHref: null,
        isFetching: true,
      };
    } else {
      return {
        title: board?.attributes?.name ?? '(unnamed board)',
        icon: board?.attributes['icon-extended'],
        titleHref: 'edit',
        isFetching,
        headerRight: () => (
          <IconButton
            icon="plus"
            onPress={handleCreateCard}
            disabled={isAddingCard}
            accessibilityLabel="Add Card"
          />
        ),
      };
    }
  })();

  useEffect(() => {
    if (board) {
      document.title = board?.attributes?.name ?? '(unnamed board)';
    }
  }, [board]);

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  return (
    <MuiProvider theme={colorTheme}>
      <NavigationBar options={navigationOptions} backTo="/" />
      <ScreenBackground style={sharedStyles.fullHeight}>
        <ColumnList board={board} isLoadingBoard={isLoadingBoard} />
        <ErrorSnackbar error={error} onRetry={refetch}>
          An error occurred loading the board.
        </ErrorSnackbar>
        <ErrorSnackbar error={createCardError}>
          An error occurred adding a card.
        </ErrorSnackbar>
      </ScreenBackground>
      <Outlet />
    </MuiProvider>
  );
}

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
      ?.call(dataType, elementOptions?.['initial-specific-value']);
    return [field.id, resolvedValue];
  });
  return Object.fromEntries(initialValueEntries);
}
