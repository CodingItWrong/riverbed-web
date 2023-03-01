import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards, useRefreshCards} from '../../data/cards';
import {useCurrentBoard} from '../../data/currentBoard';
import ColumnList from './Column/ColumnList';
import EditBoardForm from './EditBoardForm';

export default function Board(...args) {
  const {boardId} = useCurrentBoard();
  const navigation = useNavigation();
  const {data: board, isLoading: isLoadingBoard} = useBoard(boardId);

  const {isFetching: isFetchingCards} = useCards(board);
  const refreshCards = useRefreshCards(board);

  const [editingBoard, setEditingBoard] = useState(false);

  useEffect(() => {
    if (!isLoadingBoard) {
      navigation.setOptions({
        title: board?.attributes?.name ?? '(unnamed board)',
        onTitlePress: () => setEditingBoard(true),
        isFetching: isFetchingCards,
      });
    }
  }, [navigation, board, isLoadingBoard, isFetchingCards, editingBoard]);

  useFocusEffect(
    useCallback(() => {
      refreshCards();
    }, [refreshCards]),
  );

  function renderContents() {
    if (editingBoard) {
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

  if (!board) {
    return (
      <ScreenBackground style={sharedStyles.fullHeight}>
        <LoadingIndicator />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={sharedStyles.fullHeight}>
      {renderContents()}
    </ScreenBackground>
  );
}
