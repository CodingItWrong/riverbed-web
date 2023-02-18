import {useMutation, useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import startCase from 'lodash.startcase';
import {useState} from 'react';
import {View} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DropdownField from '../../components/DropdownField';
import FormGroup from '../../components/FormGroup';
import IconButton from '../../components/IconButton';
import LabeledCheckbox from '../../components/LabeledCheckbox';
import NumberField from '../../components/NumberField';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import {useElements} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import QUERIES from '../../enums/queries';
import VALUES from '../../enums/values';

export default function EditElementForm({
  element,
  board,
  onSave,
  onDelete,
  onCancel,
  style,
}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
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

  const dataTypeOptions = Object.values(FIELD_DATA_TYPES);
  const valueOptions = Object.values(VALUES);

  const {mutate: updateElement, isLoading: isSaving} = useMutation({
    mutationFn: () => {
      const updatedElement = {
        type: 'elements',
        id: element.id,
        attributes: elementAttributes,
      };
      return elementClient.update(updatedElement);
    },
    onSuccess: onSave,
  });

  const {mutate: deleteElement, isLoading: isDeleting} = useMutation({
    mutationFn: () => elementClient.delete({id: element.id}),
    onSuccess: onDelete,
  });

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
      {id: uuidv4()},
    ]);

  function removeChoiceAtIndex(index) {
    const newChoices = [...(elementAttributes.options?.choices ?? [])];
    newChoices.splice(index, 1);
    updateAttribute('options.choices', newChoices);
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
            onValueChange={option => updateAttribute('data-type', option.key)}
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
              updateAttribute('initial-value', option.key)
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
                  />
                </View>
              ))}
              <Button mode="link" onPress={addChoice}>
                Add Choice
              </Button>
            </>
          )}
        </>
      )}
      {elementType === ELEMENT_TYPES.BUTTON.key && (
        <ActionInputs
          action={elementAttributes.action}
          updateActionAttribute={(path, value) =>
            updateAttribute(`action.${path}`, value)
          }
          fields={fields}
        />
      )}
      {elementType === ELEMENT_TYPES.BUTTON_MENU.key && (
        <FormGroup title="Button Menu Items">
          {elementAttributes.options?.items?.map((menuItem, index) => (
            <View key={index /* it's fine */}>
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
                />
              </View>
              <ActionInputs
                action={menuItem.action}
                updateActionAttribute={(path, value) =>
                  updateAttribute(
                    `options.items[${index}].action.${path}`,
                    value,
                  )
                }
                fields={fields}
              />
            </View>
          ))}
          <Button mode="link" onPress={addButtonMenuItem}>
            Add Menu Item
          </Button>
        </FormGroup>
      )}
      <ShowConditionInputs
        elementAttributes={elementAttributes}
        updateAttribute={updateAttribute}
        fields={fields}
      />
      <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button
        onPress={deleteElement}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Delete Element
      </Button>
      <Button
        mode="primary"
        onPress={updateElement}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Save Element
      </Button>
    </Card>
  );
}

function ActionInputs({action, updateActionAttribute, fields}) {
  const commands = Object.values(COMMANDS);
  const valueOptions = Object.values(VALUES);

  return (
    <FormGroup title="Click Action">
      <DropdownField
        fieldLabel="Command"
        emptyLabel="(choose)"
        options={commands}
        value={commands.find(c => c.key === action?.command)}
        onValueChange={command => updateActionAttribute('command', command.key)}
        style={sharedStyles.mt}
      />
      <DropdownField
        fieldLabel="Action Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === action?.field)}
        onValueChange={field => updateActionAttribute('field', field.id)}
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
      <DropdownField
        fieldLabel="Value"
        emptyLabel="(choose)"
        options={valueOptions}
        value={valueOptions.find(o => o.key === action?.value)}
        onValueChange={option => updateActionAttribute('value', option.key)}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}

function ShowConditionInputs({elementAttributes, updateAttribute, fields}) {
  const queryOptions = Object.values(QUERIES);

  return (
    <FormGroup title="Show Condition">
      <DropdownField
        fieldLabel="Query Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(
          f => f.id === elementAttributes['show-condition']?.field,
        )}
        onValueChange={field =>
          updateAttribute('show-condition.field', field.id)
        }
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
      <DropdownField
        fieldLabel="Show Condition"
        emptyLabel="(choose)"
        options={queryOptions}
        value={queryOptions.find(
          query => query.key === elementAttributes['show-condition']?.query,
        )}
        onValueChange={query =>
          updateAttribute('show-condition.query', query.key)
        }
        keyExtractor={query => query.key}
        labelExtractor={query => query.label}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}
