import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Appbar, Provider as PaperProvider} from 'react-native-paper';
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
import EditBoardForm from './EditBoardForm';

export default function Board(...args) {
  const {boardId} = useCurrentBoard();
  const navigation = useNavigation();
  const {data: board, isLoading: isLoadingBoard} = useBoard(boardId);

  const {isFetching: isFetchingCards} = useCards(board);
  const {isFetching: isFetchingColumns} = useColumns(board);
  const {isFetching: isFetchingElements} = useBoardElements(board);
  const isFetching = isFetchingCards || isFetchingColumns || isFetchingElements;
  const refreshCards = useRefreshCards(board);

  const [editingBoard, setEditingBoard] = useState(false);

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
        onTitlePress: () => setEditingBoard(true),
        isFetching,
      });
    }
  }, [navigation, board, isLoadingBoard, isFetching, editingBoard]);

  useFocusEffect(
    useCallback(() => {
      refreshCards();
    }, [refreshCards]),
  );

  function renderContents() {
    if (!board) {
      return null;
    } else if (editingBoard) {
      return (
        <EditBoardForm
          board={board}
          onSave={() => setEditingBoard(false)}
          onDelete={() => navigation.goBack()}
          onCancel={() => setEditingBoard(false)}
        />
      );
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
          board?.attributes?.name ?? (!isLoadingBoard && '(unnamed board)')
        }
        icon={board?.attributes?.icon}
        isFetching={isFetching}
        onPressTitle={() => setEditingBoard(true)}
        colorTheme={titleBarColorTheme}
      />
      <ScreenBackground style={sharedStyles.fullHeight}>
        {renderContents()}
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
