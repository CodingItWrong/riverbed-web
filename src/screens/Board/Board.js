import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DropdownMenu from '../../components/DropdownMenu';
import IconButton from '../../components/IconButton';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import ColumnList from './ColumnList';
import EditBoardForm from './EditBoardForm';
import ElementList from './ElementList';

export default function Board({board, onDelete, onGoBack}) {
  // TODO: make these an enum
  const [editingBoard, setEditingBoard] = useState(false);
  const [editingElements, setEditingElements] = useState(false);

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

  function renderContents() {
    if (editingBoard) {
      return (
        <EditBoardForm
          board={board}
          onSave={() => setEditingBoard(false)}
          onDelete={onDelete}
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

  return (
    <View style={sharedStyles.fullHeight}>
      <View style={sharedStyles.row}>
        <IconButton
          icon="arrow-left"
          onPress={onGoBack}
          accessibilityLabel="Back to Board List"
        />
        <Text variant="titleLarge">
          {board.attributes.name ?? '(unnamed board)'}
        </Text>
        <View style={styles.spacer} />
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
      </View>
      {renderContents()}
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});
