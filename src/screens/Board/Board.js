import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useCallback} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import IconButton from '../../components/IconButton';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {
  useCards,
  useCreateCard,
  usePrimeCard,
  useRefreshCards,
} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useBoardElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import useNavigateEffect from '../../utils/useNavigateEffect';
import ColumnList from './Column/ColumnList';

export default function Board() {
  const navigate = useNavigate();
  const {boardId} = useParams();
  const {
    data: board,
    isLoading: isLoadingBoard,
    error: boardError,
  } = useBoard(boardId);

  const {isFetching: isFetchingCards, error: cardsError} = useCards(board);
  const {isFetching: isFetchingColumns, error: columnsError} =
    useColumns(board);
  const {isFetching: isFetchingElements, error: elementsError} =
    useBoardElements(board);
  const isFetching = isFetchingCards || isFetchingColumns || isFetchingElements;
  const error = boardError ?? cardsError ?? columnsError ?? elementsError;
  const refreshCards = useRefreshCards(board);

  const {data: elements} = useBoardElements(board);
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
        icon: board?.attributes?.icon,
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

  useNavigateEffect(
    useCallback(() => {
      if (board) {
        document.title = board?.attributes?.name ?? '(unnamed board)';
      }
      refreshCards();
    }, [board, refreshCards]),
  );

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  return (
    <MuiProvider theme={colorTheme}>
      <NavigationBar options={navigationOptions} backTo="/" />
      <ScreenBackground style={sharedStyles.fullHeight}>
        <ColumnList board={board} />
        <ErrorSnackbar error={error}>
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
