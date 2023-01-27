import {useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/Button';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import ColumnList from './ColumnList';
import EditBoardForm from './EditBoardForm';
import ElementList from './ElementList';

export default function Board({board, onDelete}) {
  // TODO: make these an enum
  const [editingBoard, setEditingBoard] = useState(false);
  const [editingElements, setEditingElements] = useState(false);

  function renderButton() {
    if (editingBoard) {
      return null;
    } else if (editingElements) {
      return (
        <Button onPress={() => setEditingElements(false)}>
          Done Editing Elements
        </Button>
      );
    } else {
      return (
        <>
          <Button onPress={() => setEditingBoard(true)}>Edit Board</Button>
          <Button onPress={() => setEditingElements(true)}>
            Edit Elements
          </Button>
        </>
      );
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
      return <ElementList board={board} />;
    } else {
      return <ColumnList board={board} />;
    }
  }

  return (
    <View style={sharedStyles.fullHeight}>
      <Text variant="titleLarge">{board.attributes.name}</Text>
      {renderButton()}
      {renderContents()}
    </View>
  );
}
