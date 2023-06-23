import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import {useState} from 'react';
import Button from '../../components/Button';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import Stack from '../../components/Stack';
import {useBoards} from '../../data/boards';
import {useUpdateUser} from '../../data/user';

export default function EditSettingsForm({user, onSave, onDelete, onCancel}) {
  const [attributes, setAttributes] = useState(user.attributes);

  const {data: boards = []} = useBoards();
  const sortedBoards = sortBy(boards, ['attributes.name']);

  const {
    mutate: updateUser,
    isLoading: isSaving,
    isError: isUpdateError,
  } = useUpdateUser(user);
  const handleUpdateUser = () => updateUser(attributes, {onSuccess: onSave});

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  function getErrorMessage() {
    if (isUpdateError) {
      return 'An error occurred while saving the settings';
    }
  }

  return (
    <Stack spacing={1}>
      <DropdownField
        fieldLabel="iOS Share to Board"
        emptyLabel="(none)"
        options={sortedBoards}
        value={sortedBoards.find(
          b => b.id === String(attributes['ios-share-board-id']),
        )}
        onValueChange={board =>
          updateAttribute('ios-share-board-id', board && String(board?.id))
        }
        keyExtractor={board => board.id}
        labelExtractor={board => board.attributes.name}
      />

      <ErrorMessage>{getErrorMessage()}</ErrorMessage>
      <Button onPress={onCancel} disabled={isSaving}>
        Cancel
      </Button>
      <Button mode="primary" onPress={handleUpdateUser} disabled={isSaving}>
        Save Settings
      </Button>
    </Stack>
  );
}
