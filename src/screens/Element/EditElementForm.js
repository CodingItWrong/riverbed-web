import set from 'lodash/set';
import startCase from 'lodash/startCase';
import {useState} from 'react';
import Button from '../../components/Button';
import ConditionInputs from '../../components/ConditionsInputs';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import Field from '../../components/Field';
import FormGroup from '../../components/FormGroup';
import IconButton from '../../components/IconButton';
import LabeledCheckbox from '../../components/LabeledCheckbox';
import NumberField from '../../components/NumberField';
import Stack from '../../components/Stack';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import fieldTypes from '../../components/fieldTypes';
import sharedStyles from '../../components/sharedStyles';
import {
  useBoardElements,
  useDeleteElement,
  useUpdateElement,
} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import TEXT_SIZES from '../../enums/textSizes';
import VALUES from '../../enums/values';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';
import uuid from '../../utils/uuid';

export default function EditElementForm({
  element,
  board,
  onSave,
  onDelete,
  onCancel,
  style,
}) {
  const {data: elements = []} = useBoardElements(board);
  const fields = sortByDisplayOrder(
    elements.filter(
      e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
    ),
  );

  const [elementAttributes, setElementAttributes] = useState(
    element.attributes,
  );

  function updateAttribute(path, value) {
    setElementAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const dataTypeOptions = Object.values(fieldTypes);
  const valueOptions = Object.values(VALUES);

  const {
    mutate: updateElement,
    isLoading: isSaving,
    isError: isUpdateError,
  } = useUpdateElement(element, board);
  const handleUpdateElement = () =>
    updateElement(elementAttributes, {onSuccess: onSave});

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const {
    mutate: deleteElement,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useDeleteElement(element, board);
  const handleDeleteElement = () => deleteElement(null, {onSuccess: onDelete});

  const isLoading = isSaving || isDeleting;

  const elementType = elementAttributes['element-type'];

  const addButtonMenuItem = () =>
    updateAttribute('options.items', [
      ...(elementAttributes.options?.items ?? []),
      {},
    ]);

  function removeButtonMenuItemAtIndex(index) {
    const newItems = [...elementAttributes.options?.items];
    newItems.splice(index, 1);
    updateAttribute('options.items', newItems);
  }

  const addChoice = () =>
    updateAttribute('options.choices', [
      ...(elementAttributes.options?.choices ?? []),
      {id: uuid()},
    ]);

  function removeChoiceAtIndex(index) {
    const newChoices = [...(elementAttributes.options?.choices ?? [])];
    newChoices.splice(index, 1);
    updateAttribute('options.choices', newChoices);
  }

  function getErrorMessage() {
    if (isUpdateError) {
      return `An error occurred while saving the ${elementType}`;
    } else if (isDeleteError) {
      return `An error occurred while deleting the ${elementType}`;
    }
  }

  function getDeleteConfirmationMessageExtraContent() {
    if (elementType === ELEMENT_TYPES.FIELD.key) {
      return 'Values on all cards will be lost. ';
    } else {
      return '';
    }
  }

  return (
    <Stack spacing={1}>
      <TextField
        label={`${startCase(elementType)} Name`}
        value={elementAttributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-element-name"
      />
      <NumberField
        keyboard-type="number-pad"
        label="Order"
        value={
          elementAttributes['display-order'] == null
            ? ''
            : String(elementAttributes['display-order'])
        }
        onChangeText={value =>
          updateAttribute('display-order', value === '' ? null : Number(value))
        }
        testID="number-input-order"
      />
      {elementType === ELEMENT_TYPES.FIELD.key && (
        <>
          <DropdownField
            fieldLabel="Data Type"
            emptyLabel="(choose)"
            value={dataTypeOptions.find(
              o => o.key === elementAttributes['data-type'],
            )}
            onValueChange={option => updateAttribute('data-type', option?.key)}
            options={dataTypeOptions}
          />
          <DropdownField
            fieldLabel="Initial Value"
            emptyLabel="(choose)"
            value={valueOptions.find(
              o => o.key === elementAttributes['initial-value'],
            )}
            onValueChange={option =>
              updateAttribute('initial-value', option?.key)
            }
            options={valueOptions}
          />
          {elementAttributes['initial-value'] === VALUES.SPECIFIC_VALUE.key && (
            <Field
              field={element}
              label="Initial value"
              value={elementAttributes.options?.['initial-specific-value']}
              setValue={v =>
                updateAttribute("options['initial-specific-value']", v)
              }
            />
          )}
          <LabeledCheckbox
            label="Show Label When Read-Only"
            checked={elementAttributes.options['show-label-when-read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('options.show-label-when-read-only', newChecked)
            }
            testID="checkbox-show-label-when-read-only"
          />
          <LabeledCheckbox
            label="Read-Only"
            checked={elementAttributes['read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('read-only', newChecked)
            }
            testID="checkbox-read-only"
          />
          {elementAttributes['data-type'] === FIELD_DATA_TYPES.TEXT.key && (
            <LabeledCheckbox
              label="Multiple Lines"
              checked={elementAttributes.options.multiline}
              onChangeChecked={newChecked =>
                updateAttribute('options.multiline', newChecked)
              }
            />
          )}
          {elementAttributes['data-type'] === FIELD_DATA_TYPES.CHOICE.key && (
            <>
              {elementAttributes.options.choices?.map((choice, index) => (
                <div key={index /* it's fine */} style={sharedStyles.row}>
                  <TextField
                    label="Choice"
                    value={choice.label ?? ''}
                    onChangeText={value =>
                      updateAttribute(`options.choices[${index}].label`, value)
                    }
                    testID={`text-input-choice-${index}-label`}
                    style={sharedStyles.fill}
                  />
                  <IconButton
                    icon="close-circle"
                    onPress={() => removeChoiceAtIndex(index)}
                    accessibilityLabel="Remove choice"
                  />
                </div>
              ))}
              <Button mode="link" icon="plus" onPress={addChoice}>
                Add Choice
              </Button>
            </>
          )}
          <FormGroup title="Summary View">
            <LabeledCheckbox
              label="Show Field"
              checked={elementAttributes['show-in-summary']}
              onChangeChecked={newChecked =>
                updateAttribute('show-in-summary', newChecked)
              }
              testID="checkbox-show-in-summary"
              style={styles.checkboxFix}
            />
            <DropdownField
              fieldLabel="Text Size"
              emptyLabel="(choose)"
              value={TEXT_SIZES.find(
                o => o.key === elementAttributes.options['text-size'],
              )}
              onValueChange={option =>
                updateAttribute('options["text-size"]', option?.key)
              }
              options={TEXT_SIZES}
              labelExtractor={option => (
                <Text size={option.key}>{option.label}</Text>
              )}
            />
            <LabeledCheckbox
              label="Link URLs"
              checked={elementAttributes.options['link-urls']}
              onChangeChecked={newChecked =>
                updateAttribute('options["link-urls"]', newChecked)
              }
            />
            <LabeledCheckbox
              label="Abbreviate URLs"
              checked={elementAttributes.options['abbreviate-urls']}
              onChangeChecked={newChecked =>
                updateAttribute('options["abbreviate-urls"]', newChecked)
              }
            />
          </FormGroup>
        </>
      )}
      {elementType === ELEMENT_TYPES.BUTTON.key && (
        <ActionInputs
          actions={elementAttributes.options?.actions ?? []}
          updateActionsAttribute={(path, value) =>
            updateAttribute(`options.actions${path}`, value)
          }
          attributes={elementAttributes}
          updateAttribute={updateAttribute}
          fields={fields}
        />
      )}
      {elementType === ELEMENT_TYPES.BUTTON_MENU.key && (
        <FormGroup title="Button Menu Items">
          {elementAttributes.options?.items?.map((menuItem, index) => (
            <div key={index /* it's fine */} data-testid={`menu-item-${index}`}>
              <div style={sharedStyles.row}>
                <TextField
                  label="Menu Item Name"
                  testID={`text-input-menu-item-${index}-name`}
                  value={menuItem.name ?? ''}
                  onChangeText={newName =>
                    updateAttribute(`options.items[${index}].name`, newName)
                  }
                  style={sharedStyles.fill}
                />
                <IconButton
                  icon="close-circle"
                  onPress={() => removeButtonMenuItemAtIndex(index)}
                  accessibilityLabel="Remove menu item"
                />
              </div>
              <ActionInputs
                actions={menuItem.actions ?? []}
                updateActionsAttribute={(path, value) =>
                  updateAttribute(
                    `options.items[${index}].actions${path}`,
                    value,
                  )
                }
                fields={fields}
              />
            </div>
          ))}
          <Button mode="link" icon="plus" onPress={addButtonMenuItem}>
            Add Menu Item
          </Button>
        </FormGroup>
      )}
      <ShowConditionsInputs
        attributes={elementAttributes}
        updateAttribute={updateAttribute}
        fields={fields}
      />
      <ErrorMessage>{getErrorMessage()}</ErrorMessage>
      <ConfirmationDialog
        destructive
        open={confirmingDelete}
        title={`Delete ${startCase(elementType)}?`}
        message={`Are you sure you want to delete ${elementType} "${
          elementAttributes.name
        }"? ${getDeleteConfirmationMessageExtraContent()}Data will not be able to be recovered.`}
        confirmButtonLabel={`Yes, Delete ${startCase(elementType)}`}
        onConfirm={handleDeleteElement}
        onDismiss={() => setConfirmingDelete(false)}
      />
      <Button onPress={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button onPress={() => setConfirmingDelete(true)} disabled={isLoading}>
        Delete {startCase(elementType)}
      </Button>
      <Button mode="primary" onPress={handleUpdateElement} disabled={isLoading}>
        Save {startCase(elementType)}
      </Button>
    </Stack>
  );
}

function ActionInputs({actions, updateActionsAttribute, fields}) {
  const commands = Object.values(COMMANDS);
  const valueOptions = Object.values(VALUES);

  function addAction() {
    updateActionsAttribute('', [...actions, {}]);
  }

  function removeActionAtIndex(index) {
    const newActions = [...actions];
    newActions.splice(index, 1);
    updateActionsAttribute('', newActions);
  }

  return (
    <FormGroup title="Click Actions">
      {actions.map((action, index) => (
        <div key={`action-${index}`} style={sharedStyles.row}>
          <div style={{...styles.actionElements, ...sharedStyles.mt}}>
            <DropdownField
              fieldLabel="Command"
              emptyLabel="(choose)"
              options={commands}
              value={commands.find(c => c.key === action.command)}
              onValueChange={command =>
                updateActionsAttribute(`[${index}].command`, command?.key)
              }
              style={styles.actionButton}
            />
            <DropdownField
              fieldLabel="Action Field"
              emptyLabel="(choose)"
              options={fields}
              value={fields.find(f => f.id === action.field)}
              onValueChange={field =>
                updateActionsAttribute(`[${index}].field`, field?.id)
              }
              keyExtractor={field => field.id}
              labelExtractor={field => field.attributes.name}
              style={styles.actionButton}
            />
            {action.command !== COMMANDS.ADD_DAYS.key && (
              <DropdownField
                fieldLabel="Value"
                emptyLabel="(choose)"
                options={valueOptions}
                value={valueOptions.find(o => o.key === action?.value)}
                onValueChange={option =>
                  updateActionsAttribute(`[${index}].value`, option?.key)
                }
                style={styles.actionButton}
              />
            )}
            {action.command === COMMANDS.ADD_DAYS.key && (
              <NumberField
                label="Days to Add"
                testID="number-input-value"
                value={action?.value ?? ''}
                onChangeText={value =>
                  updateActionsAttribute(`[${index}].value`, value)
                }
                style={styles.actionButton}
              />
            )}
          </div>
          <IconButton
            icon="close-circle"
            accessibilityLabel="Remove action"
            onPress={() => removeActionAtIndex(index)}
          />
        </div>
      ))}
      <Button icon="plus" mode="link" onPress={addAction}>
        Add Action
      </Button>
    </FormGroup>
  );
}

function ShowConditionsInputs({attributes, updateAttribute, fields}) {
  function updateConditionsPath(path, value) {
    updateAttribute(`show-conditions${path}`, value);
  }

  return (
    <FormGroup title="Show Conditions">
      <ConditionInputs
        conditions={attributes['show-conditions']}
        updateConditionsPath={updateConditionsPath}
        fields={fields}
      />
    </FormGroup>
  );
}

const styles = {
  actionElements: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginRight: 8,
  },
  checkboxFix: {
    marginLeft: 0, // to correct negative margin MUI adds
  },
};
