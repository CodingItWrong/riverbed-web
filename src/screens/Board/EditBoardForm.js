import set from 'lodash.set';
import {useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import TextField from '../../components/TextField';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useDeleteBoard, useUpdateBoard} from '../../data/boards';

export default function EditBoardForm({board, onSave, onDelete, onCancel}) {
  const [attributes, setAttributes] = useState(board.attributes);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    mutate: updateBoard,
    isLoading: isSaving,
    isError: isUpdateError,
  } = useUpdateBoard(board);
  const handleUpdateBoard = () => updateBoard(attributes, {onSuccess: onSave});

  const {
    mutate: deleteBoard,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useDeleteBoard(board);
  const handleDeleteBoard = () => deleteBoard(null, {onSuccess: onDelete});

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const isLoading = isSaving || isDeleting;

  const columnStyle = useColumnStyle();

  function getErrorMessage() {
    if (isUpdateError) {
      return 'An error occurred while saving the board';
    } else if (isDeleteError) {
      return 'An error occurred while deleting the board';
    }
  }

  return (
    <View style={sharedStyles.columnPadding}>
      <Card style={columnStyle}>
        <TextField
          label="Name"
          value={attributes.name ?? ''}
          onChangeText={value => updateAttribute('name', value)}
          testID="text-input-board-name"
          style={sharedStyles.mt}
        />
        <ErrorMessage>{getErrorMessage()}</ErrorMessage>
        <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
          Cancel
        </Button>
        {confirmingDelete ? (
          <Button
            onPress={handleDeleteBoard}
            disabled={isLoading}
            style={sharedStyles.mt}
          >
            Confirm Delete Board
          </Button>
        ) : (
          <Button
            onPress={() => setConfirmingDelete(true)}
            disabled={isLoading}
            style={sharedStyles.mt}
          >
            Delete Board
          </Button>
        )}
        <Button
          mode="primary"
          onPress={handleUpdateBoard}
          disabled={isLoading}
          style={sharedStyles.mt}
        >
          Save Board
        </Button>
      </Card>
    </View>
  );
}
