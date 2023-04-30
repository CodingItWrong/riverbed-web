import set from 'lodash.set';
import sortBy from 'lodash.sortby';
import {useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/Button';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import sharedStyles from '../../components/sharedStyles';
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
    <View>
      <DropdownField
        fieldLabel="iOS Share to Board"
        emptyLabel="(none)"
        options={sortedBoards}
        value={sortedBoards.find(
          b => b.id === String(attributes['ios-share-board-id']),
        )}
        onValueChange={board =>
          updateAttribute('ios-share-board-id', String(board?.id))
        }
        keyExtractor={board => board.id}
        labelExtractor={board => `${board.id} - ${board.attributes.name}`}
        style={sharedStyles.mt}
      />

      <ErrorMessage>{getErrorMessage()}</ErrorMessage>
      <Button onPress={onCancel} disabled={isSaving} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button
        mode="primary"
        onPress={handleUpdateUser}
        disabled={isSaving}
        style={sharedStyles.mt}
      >
        Save Settings
      </Button>
    </View>
  );
}
