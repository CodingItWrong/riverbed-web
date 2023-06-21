import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards, useRefreshCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useBoardElements} from '../../data/elements';
import useColorSchemeTheme, {
  usePaperColorSchemeTheme,
} from '../../theme/useColorSchemeTheme';
import useNavigateEffect from '../../utils/useNavigateEffect';
import ColumnList from './Column/ColumnList';

export default function Board() {
  const {boardId} = useParams();
  const navigate = useNavigate();
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

  const editBoard = useCallback(
    () => board && navigate('edit'),
    [navigate, board],
  );

  let navigationOptions = (() => {
    if (isLoadingBoard) {
      return {
        title: null,
        icon: null,
        onTitlePress: null,
        isFetching: true,
      };
    } else {
      return {
        title: board?.attributes?.name ?? '(unnamed board)',
        icon: board?.attributes?.icon,
        onTitlePress: () => editBoard(),
        isFetching,
      };
    }
  })();

  useNavigateEffect(
    useCallback(() => {
      refreshCards();
    }, [refreshCards]),
  );

  function renderContents() {
    if (!board) {
      return null;
    } else {
      return <ColumnList board={board} />;
    }
  }

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  return (
    <MuiProvider theme={colorTheme}>
      <NavigationBar options={navigationOptions} backTo="/" />
      <ScreenBackground style={sharedStyles.fullHeight}>
        {renderContents()}
        <ErrorSnackbar error={error}>
          An error occurred loading the board.
        </ErrorSnackbar>
      </ScreenBackground>
    </MuiProvider>
  );
}
