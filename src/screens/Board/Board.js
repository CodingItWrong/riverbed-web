import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {Appbar, Provider as PaperProvider} from 'react-native-paper';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import {Icon} from '../../components/Icon';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards, useRefreshCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useCurrentBoard} from '../../data/currentBoard';
import {useBoardElements} from '../../data/elements';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
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

  // keep title bar gray until board loaded
  const titleBarColorTheme = board ? colorTheme : null;

  return (
    <PaperProvider theme={colorTheme}>
      <EmbeddedHeader
        title={
          board?.attributes?.name ??
          (!isLoadingBoard && !error && '(click to name board)')
        }
        icon={board?.attributes?.icon}
        isFetching={isFetching}
        onPressTitle={() => editBoard()}
        colorTheme={titleBarColorTheme}
      />
      <ScreenBackground style={sharedStyles.fullHeight}>
        {renderContents()}
        <ErrorSnackbar error={error}>
          An error occurred loading the board.
        </ErrorSnackbar>
      </ScreenBackground>
    </PaperProvider>
  );
}

// TODO: extract and remove duplication
function EmbeddedHeader({title, icon, isFetching, onPressTitle, colorTheme}) {
  const navigation = useNavigation();
  return (
    <Appbar.Header
      elevated
      style={{backgroundColor: colorTheme?.colors?.secondaryContainer}}
    >
      <Appbar.BackAction
        color={colorTheme?.colors?.onSecondaryContainer}
        onPress={navigation.goBack}
        accessibilityLabel="Go back"
      />
      <Appbar.Content
        title={
          <View style={sharedStyles.row}>
            {icon && (
              <Icon
                name={icon}
                color={colorTheme?.colors?.onSecondaryContainer}
                style={sharedStyles.mr}
              />
            )}
            <Text
              variant="titleLarge"
              style={{color: colorTheme?.colors?.onSecondaryContainer}}
            >
              {title}
            </Text>
          </View>
        }
        onPress={onPressTitle}
        testID="navigation-bar-title"
      />
      <LoadingIndicator loading={Boolean(isFetching)} style={sharedStyles.mr} />
    </Appbar.Header>
  );
}
