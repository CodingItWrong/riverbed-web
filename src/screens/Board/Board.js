import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useCallback} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Icon from '../../components/Icon';
import LoadingIndicator from '../../components/LoadingIndicator';
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
  const paperColorTheme = usePaperColorSchemeTheme(
    board?.attributes['color-theme'],
  );

  return (
    <PaperProvider theme={paperColorTheme}>
      <MuiProvider theme={colorTheme}>
        <EmbeddedHeader
          title={navigationOptions.title}
          icon={navigationOptions.icon}
          isFetching={navigationOptions.isFetching}
          onTitlePress={navigationOptions.onTitlePress}
        />
        <ScreenBackground style={sharedStyles.fullHeight}>
          {renderContents()}
          <ErrorSnackbar error={error}>
            An error occurred loading the board.
          </ErrorSnackbar>
        </ScreenBackground>
      </MuiProvider>
    </PaperProvider>
  );
}

// TODO: may not need a duplicate header now that it isn't themed separately;
// wait until removing React Navigation to see
function EmbeddedHeader({title, icon, isFetching, onTitlePress}) {
  return (
    <AppBar position="relative">
      <Toolbar>
        <BackButton to="/" />
        {icon && <Icon name={icon} style={sharedStyles.mr} />}
        <Button
          color="inherit"
          onClick={onTitlePress}
          data-testid="navigation-bar-title"
        >
          {title}
        </Button>
        <LoadingIndicator loading={Boolean(isFetching)} />
      </Toolbar>
    </AppBar>
  );
}
