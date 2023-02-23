import {useMutation, useQueryClient} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TextField from '../../components/TextField';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useBoardClient, useUpdateBoard} from '../../data/boards';

export default function EditBoardForm({board, onSave, onDelete, onCancel}) {
  const queryClient = useQueryClient();
  const boardClient = useBoardClient();
  const [attributes, setAttributes] = useState(board.attributes);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const refreshBoards = () => queryClient.invalidateQueries(['boards']);

  const {mutate: updateBoard, isLoading: isSaving} = useUpdateBoard(board);
  const handleUpdateBoard = () =>
    updateBoard(attributes, {
      onSuccess: () => {
        refreshBoards();
        onSave();
      },
    });

  const {mutate: deleteBoard, isLoading: isDeleting} = useMutation({
    mutationFn: () => boardClient.delete({id: board.id}),
    onSuccess: () => {
      refreshBoards();
      onDelete();
    },
  });

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const isLoading = isSaving || isDeleting;

  const columnStyle = useColumnStyle();

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
        <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
          Cancel
        </Button>
        {confirmingDelete ? (
          <Button
            onPress={deleteBoard}
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
