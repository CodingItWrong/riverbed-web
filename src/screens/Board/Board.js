import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {useCallback, useEffect, useState} from 'react';
import DropdownMenu from '../../components/DropdownMenu';
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
  const {id} = route.params;

  const navigation = useNavigation();
  const {data: board, isLoading: isLoadingBoard} = useBoard(id);

  const {isFetching: isFetchingCards} = useCards(board);

  useEffect(() => {
    if (!isLoadingBoard) {
      navigation.setOptions({
        title: board?.attributes?.name ?? '(unnamed board)',
        headerRight: renderMenu,
        isFetching: isFetchingCards,
      });
    }
  }, [navigation, board, renderMenu, isLoadingBoard, isFetchingCards]);

  const renderMenu = useCallback(() => {
    function menuItems() {
      if (editingBoard || editingElements) {
        return [];
      } else {
        return [
          {title: 'Edit Board', onPress: () => setEditingBoard(true)},
          {title: 'Edit Elements', onPress: () => setEditingElements(true)},
        ];
      }
    }

    return (
      <DropdownMenu
        menuItems={menuItems()}
        menuButton={props => (
          <IconButton
            icon="dots-vertical"
            accessibilityLabel="Board Menu"
            {...props}
          />
        )}
      />
    );
  }, [editingBoard, editingElements]);

  // TODO: make these an enum
  const [editingBoard, setEditingBoard] = useState(false);
  const [editingElements, setEditingElements] = useState(false);

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
