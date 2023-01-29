import {useMutation, useQueryClient} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';

export default function EditBoardForm({board, onSave, onDelete, onCancel}) {
  const queryClient = useQueryClient();
  const boardClient = useBoards();
  const [attributes, setAttributes] = useState(board.attributes);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const refreshBoards = () => queryClient.invalidateQueries(['boards']);

  const {mutate: updateBoard} = useMutation({
    mutationFn: () => {
      const updatedBoard = {
        type: 'boards',
        id: board.id,
        attributes,
      };
      return boardClient.update(updatedBoard);
    },
    onSuccess: () => {
      refreshBoards();
      onSave();
    },
  });

  const {mutate: deleteBoard} = useMutation({
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

  return (
    <Card>
      <TextField
        label="Name"
        value={attributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-board-name"
        style={sharedStyles.mt}
      />
      <Button onPress={onCancel} style={sharedStyles.mt}>
        Cancel
      </Button>
      {confirmingDelete ? (
        <Button onPress={deleteBoard} style={sharedStyles.mt}>
          Confirm Delete Board
        </Button>
      ) : (
        <Button
          onPress={() => setConfirmingDelete(true)}
          style={sharedStyles.mt}
        >
          Delete Board
        </Button>
      )}
      <Button primary onPress={updateBoard} style={sharedStyles.mt}>
        Save Board
      </Button>
    </Card>
  );
}
