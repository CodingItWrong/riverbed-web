import set from 'lodash.set';
import startCase from 'lodash.startcase';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import ConditionInputs from '../../../components/ConditionsInputs';
import DropdownField from '../../../components/DropdownField';
import ErrorMessage from '../../../components/ErrorMessage';
import FormGroup from '../../../components/FormGroup';
import IconButton from '../../../components/IconButton';
import LabeledCheckbox from '../../../components/LabeledCheckbox';
import NumberField from '../../../components/NumberField';
import TextField from '../../../components/TextField';
import fieldTypes from '../../../components/fieldTypes';
import sharedStyles from '../../../components/sharedStyles';
import {
  useBoardElements,
  useDeleteElement,
  useUpdateElement,
} from '../../../data/elements';
import COMMANDS from '../../../enums/commands';
import ELEMENT_TYPES from '../../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../../enums/fieldDataTypes';
import VALUES from '../../../enums/values';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';
import uuid from '../../../utils/uuid';

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

  return (
    <Card style={style}>
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
            style={sharedStyles.mt}
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
            style={sharedStyles.mt}
          />
          <LabeledCheckbox
            label="Show in Summary"
            checked={elementAttributes['show-in-summary']}
            onChangeChecked={newChecked =>
              updateAttribute('show-in-summary', newChecked)
            }
            style={sharedStyles.mt}
            testID="checkbox-show-in-summary"
          />
          <LabeledCheckbox
            label="Show Label When Read-Only"
            checked={elementAttributes.options['show-label-when-read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('options.show-label-when-read-only', newChecked)
            }
            style={sharedStyles.mt}
            testID="checkbox-show-label-when-read-only"
          />
          <LabeledCheckbox
            label="Read-Only"
            checked={elementAttributes['read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('read-only', newChecked)
            }
            style={sharedStyles.mt}
            testID="checkbox-read-only"
          />
          {elementAttributes['data-type'] === FIELD_DATA_TYPES.TEXT.key && (
            <LabeledCheckbox
              label="Multiple Lines"
              checked={elementAttributes.options.multiline}
              onChangeChecked={newChecked =>
                updateAttribute('options.multiline', newChecked)
              }
              style={sharedStyles.mt}
            />
          )}
          {elementAttributes['data-type'] === FIELD_DATA_TYPES.CHOICE.key && (
            <>
              {elementAttributes.options.choices?.map((choice, index) => (
                <View key={index /* it's fine */} style={sharedStyles.row}>
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
                </View>
              ))}
              <Button mode="link" icon="plus" onPress={addChoice}>
                Add Choice
              </Button>
            </>
          )}
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
            <View key={index /* it's fine */} testID={`menu-item-${index}`}>
              <View style={sharedStyles.row}>
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
              </View>
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
            </View>
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
      <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button
        onPress={handleDeleteElement}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Delete {startCase(elementType)}
      </Button>
      <Button
        mode="primary"
        onPress={handleUpdateElement}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Save {startCase(elementType)}
      </Button>
    </Card>
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
        <View key={`action-${index}`} style={styles.actionRow}>
          <View style={[styles.actionElements, sharedStyles.mt]}>
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
          </View>
          <IconButton
            icon="close-circle"
            accessibilityLabel="Remove action"
            onPress={() => removeActionAtIndex(index)}
          />
        </View>
      ))}
      <Button
        icon="plus"
        mode="link"
        onPress={addAction}
        style={sharedStyles.mt}
      >
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

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionElements: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginRight: 8,
  },
});
