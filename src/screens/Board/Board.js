import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCards} from '../../data/cards';
import ColumnList from './Column/ColumnList';
import EditBoardForm from './EditBoardForm';
import ElementList from './Element/ElementList';

export default function Board({route}) {
  const hookRoute = useRoute();
  console.log('Board', {route, hookRoute});
  const id = window.location
    ? window.location.pathname.split('/')[2]
    : route.params.boardId;
  console.log({split: window.location.pathname.split('/'), id});

  const navigation = useNavigation();
  const {data: board, isLoading: isLoadingBoard} = useBoard(id);

  const {isFetching: isFetchingCards} = useCards(board);

  // TODO: make these an enum
  const [editingBoard, setEditingBoard] = useState(false);
  const [editingElements, setEditingElements] = useState(false);

  useEffect(() => {
    if (!isLoadingBoard) {
      navigation.setOptions({
        title: board?.attributes?.name ?? '(unnamed board)',
        onTitlePress: () => setEditingBoard(true),
        headerRight: () => {
          if (!(editingBoard || editingElements)) {
            return (
              <IconButton
                icon="pencil"
                accessibilityLabel="Edit Elements"
                onPress={() => setEditingElements(true)}
              />
            );
          }
        },
        isFetching: isFetchingCards,
      });
    }
  }, [
    navigation,
    board,
    isLoadingBoard,
    isFetchingCards,
    editingBoard,
    editingElements,
  ]);

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
    } else if (editingElements) {
      return (
        <ElementList board={board} onClose={() => setEditingElements(false)} />
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
