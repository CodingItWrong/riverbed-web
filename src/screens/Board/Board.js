import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DropdownMenu from '../../components/DropdownMenu';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';
import ColumnList from './ColumnList';
import EditBoardForm from './EditBoardForm';
import ElementList from './ElementList';

export default function Board({route}) {
  const {id} = route.params;

  const navigation = useNavigation();
  const boardClient = useBoards();
  const {data: board} = useQuery(['boards', id], () =>
    boardClient.find({id}).then(response => response.data),
  );

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

  console.log({board});
  if (!board) {
    return (
      <View style={sharedStyles.fullHeight}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <ScreenBackground style={sharedStyles.fullHeight}>
      <View style={sharedStyles.row}>
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});
