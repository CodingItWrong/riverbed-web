import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards, useRefreshCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useCurrentBoard} from '../../data/currentBoard';
import {useBoardElements} from '../../data/elements';
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

  return (
    <ScreenBackground style={sharedStyles.fullHeight}>
      {renderContents()}
    </ScreenBackground>
  );
}
