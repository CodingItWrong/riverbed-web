import set from 'lodash/set';
import {useState} from 'react';
import Button from '../../components/Button';
import ButtonGroup from '../../components/ButtonGroup';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import Stack from '../../components/Stack';
import TextField from '../../components/TextField';
import {useDeleteBoard, useUpdateBoard} from '../../data/boards';
import {useBoardElements} from '../../data/elements';
import COLOR_THEMES from '../../enums/colorThemes';
import ELEMENT_TYPES from '../../enums/elementTypes';
import ICONS from '../../enums/icons';
import useKeyHandler from '../../hooks/useKeyHandler';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';

export default function EditBoardForm({board, onSave, onDelete, onCancel}) {
  const [attributes, setAttributes] = useState(board.attributes);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {data: elements = []} = useBoardElements(board);
  const fields = sortByDisplayOrder(
    elements.filter(
      e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
    ),
  );

  useKeyHandler('Escape', onCancel);

  const {
    mutate: updateBoard,
    isLoading: isSaving,
    isError: isUpdateError,
  } = useUpdateBoard(board);
  function handleUpdateBoard(e) {
    e.preventDefault();
    updateBoard(attributes, {onSuccess: onSave});
  }

  const {
    mutate: deleteBoard,
    isLoading: isDeleting,
    isError: isDeleteError,
    reset: clearDeleteError,
  } = useDeleteBoard(board);
  const handleDeleteBoard = () => {
    setConfirmingDelete(false);
    deleteBoard(null, {onSuccess: onDelete});
  };

  function confirmDelete() {
    clearDeleteError();
    setConfirmingDelete(true);
  }

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const isLoading = isSaving || isDeleting;

  function getErrorMessage() {
    if (isUpdateError) {
      return 'An error occurred while saving the board';
    } else if (isDeleteError) {
      return 'An error occurred while deleting the board';
    }
  }

  return (
    <>
      <ConfirmationDialog
        destructive
        open={confirmingDelete}
        title="Delete Board?"
        message={`Are you sure you want to delete ${
          attributes.name ? `board "${attributes.name}"` : 'this board'
        }? Data will not be able to be recovered.`}
        confirmButtonLabel="Yes, Delete Board"
        onConfirm={handleDeleteBoard}
        onDismiss={() => setConfirmingDelete(false)}
      />
      <form>
        <Stack spacing={1}>
          <TextField
            label="Board Name"
            value={attributes.name ?? ''}
            onChangeText={value => updateAttribute('name', value)}
            testID="text-input-board-name"
          />
          <ButtonGroup
            label="Color Theme"
            value={attributes['color-theme']}
            onChangeValue={value => updateAttribute('color-theme', value)}
            options={COLOR_THEME_OPTIONS}
          />
          <ButtonGroup
            label="Icon"
            value={attributes['icon-extended']}
            onChangeValue={value => updateAttribute('icon-extended', value)}
            options={ICON_OPTIONS}
          />
          <TextField
            label="Card Create Webhook"
            value={attributes.options.webhooks?.['card-create'] ?? ''}
            onChangeText={value =>
              updateAttribute('options.webhooks["card-create"]', value || null)
            }
          />
          <TextField
            label="Card Update Webhook"
            value={attributes.options.webhooks?.['card-update'] ?? ''}
            onChangeText={value =>
              updateAttribute('options.webhooks["card-update"]', value || null)
            }
          />
          <DropdownField
            fieldLabel="Share URL Field"
            emptyLabel="(field)"
            options={fields}
            value={fields.find(
              f => f.id === attributes.options.share?.['url-field'],
            )}
            onValueChange={field =>
              updateAttribute('options.share["url-field"]', field?.id)
            }
            keyExtractor={field => field.id}
            labelExtractor={field => field.attributes.name}
          />
          <DropdownField
            fieldLabel="Share Title Field"
            emptyLabel="(field)"
            options={fields}
            value={fields.find(
              f => f.id === attributes.options.share?.['title-field'],
            )}
            onValueChange={field =>
              updateAttribute('options.share["title-field"]', field?.id)
            }
            keyExtractor={field => field.id}
            labelExtractor={field => field.attributes.name}
          />

          <ErrorMessage>{getErrorMessage()}</ErrorMessage>
          <Button onPress={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onPress={confirmDelete} disabled={isLoading}>
            Delete Board
          </Button>
          <Button
            type="submit"
            mode="primary"
            onPress={handleUpdateBoard}
            disabled={isLoading}
          >
            Save Board
          </Button>
        </Stack>
      </form>
    </>
  );
}

const COLOR_THEME_OPTIONS = [
  {key: null, label: 'Default'},
  ...Object.values(COLOR_THEMES),
].map(colorTheme => ({
  key: colorTheme.key,
  label: colorTheme.label,
  icon: 'square',
  iconColor: colorTheme.key ?? 'default',
}));

const ICON_OPTIONS = [{key: null, label: 'None'}, ...ICONS].map(icon => ({
  key: icon.key,
  label: icon.label,
  icon: icon.muiName ?? 'dots-square',
}));
