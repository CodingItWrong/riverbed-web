import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import BackButton from '../../components/BackButton';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Icon from '../../components/Icon';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards, useRefreshCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useCurrentBoard} from '../../data/currentBoard';
import {useBoardElements} from '../../data/elements';
import useColorSchemeTheme, {
  usePaperColorSchemeTheme,
} from '../../theme/useColorSchemeTheme';
import ColumnList from './Column/ColumnList';

export default function Board() {
  const {boardId} = useCurrentBoard();
  const navigation = useNavigation();
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
    () => navigation.navigate('BoardEdit', {boardId: board?.id}),
    [navigation, board?.id],
  );

  useEffect(() => {
    if (isLoadingBoard) {
      navigation.setOptions({
        title: null,
        icon: null,
        onTitlePress: null,
        isFetching: true,
      });
    } else {
      navigation.setOptions({
        title: board?.attributes?.name ?? '(unnamed board)',
        icon: board?.attributes?.icon,
        onTitlePress: () => editBoard(),
        isFetching,
      });
    }
  }, [navigation, board, isLoadingBoard, isFetching, editBoard]);

  useFocusEffect(
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
          title={
            board?.attributes?.name ??
            (!isLoadingBoard && !error && '(click to name board)')
          }
          icon={board?.attributes?.icon}
          isFetching={isFetching}
          onTitlePress={() => editBoard()}
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
        <BackButton />
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
