import {useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import LabeledCheckbox from '../../components/LabeledCheckbox';
import TextField from '../../components/TextField';
import {useElements} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import QUERIES from '../../enums/queries';
import VALUES from '../../enums/values';

export default function EditElementForm({element, onSave, onDelete, onCancel}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.field,
  );

  const [currentElementId, setCurrentElementId] = useState(null);
  const [elementAttributes, setElementAttributes] = useState(
    element.attributes,
  );

  useEffect(() => {
    if (element.id !== currentElementId) {
      setCurrentElementId(element.id);
      setElementAttributes(element.attributes);
    }
  }, [currentElementId, element.id, element.attributes]);

  function updateAttribute(path, value) {
    setElementAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  // TODO: move display labels to the central config for these
  const dataTypeOptions = [
    {label: 'Text', value: FIELD_DATA_TYPES.text},
    {label: 'Date', value: FIELD_DATA_TYPES.date},
  ];

  function handleSave() {
    onSave(elementAttributes);
  }

  return (
    <View>
      <TextField
        label="Field Name"
        value={elementAttributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-element-name"
      />
      {elementAttributes['element-type'] === ELEMENT_TYPES.field && (
        <>
          <Dropdown
            fieldLabel="Data Type"
            emptyLabel="(choose)"
            value={dataTypeOptions.find(
              o => o.value === elementAttributes['data-type'],
            )}
            onValueChange={option => updateAttribute('data-type', option.value)}
            options={dataTypeOptions}
            keyExtractor={option => option.value}
            labelExtractor={option => option.label}
          />
          <LabeledCheckbox
            label="Show in Summary"
            checked={elementAttributes['show-in-summary']}
            onChangeChecked={newChecked =>
              updateAttribute('show-in-summary', newChecked)
            }
            testID="checkbox-show-in-summary"
          />
          <LabeledCheckbox
            label="Read-Only"
            checked={elementAttributes['read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('read-only', newChecked)
            }
            testID="checkbox-read-only"
          />
        </>
      )}
      {elementAttributes['element-type'] === ELEMENT_TYPES.button && (
        <ActionInputs
          elementAttributes={elementAttributes}
          updateAttribute={updateAttribute}
          fields={fields}
        />
      )}
      <ShowConditionInputs
        elementAttributes={elementAttributes}
        updateAttribute={updateAttribute}
        fields={fields}
      />
      <Button onPress={onCancel}>Cancel</Button>
      <Button onPress={onDelete}>Delete Element</Button>
      <Button onPress={handleSave}>Save Element</Button>
    </View>
  );
}

function ActionInputs({elementAttributes, updateAttribute, fields}) {
  const commandOptions = [{label: 'Set Value', value: COMMANDS.SET_VALUE}];
  const valueOptions = [
    {label: 'Empty', value: VALUES.EMPTY},
    {label: 'Now', value: VALUES.NOW},
  ];

  return (
    <>
      <Dropdown
        fieldLabel="Command"
        emptyLabel="(choose)"
        options={commandOptions}
        value={commandOptions.find(
          o => o.value === elementAttributes.action?.command,
        )}
        onValueChange={option =>
          updateAttribute('action.command', option.value)
        }
        keyExtractor={option => option.value}
        labelExtractor={option => option.label}
      />
      <Dropdown
        fieldLabel="Action Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === elementAttributes.action?.field)}
        onValueChange={field => updateAttribute('action.field', field.id)}
        keyExtractor={field => field.id}
        labelExtractor={field => `In ${field.attributes.name}`}
      />
      <Dropdown
        fieldLabel="Value"
        emptyLabel="(choose)"
        options={valueOptions}
        value={valueOptions.find(
          o => o.value === elementAttributes.action?.value,
        )}
        onValueChange={option => updateAttribute('action.value', option.value)}
        keyExtractor={option => option.value}
        labelExtractor={option => option.label}
      />
    </>
  );
}

function ShowConditionInputs({elementAttributes, updateAttribute, fields}) {
  const queryOptions = [
    {label: 'Empty', value: QUERIES.IS_EMPTY},
    {label: 'Not Empty', value: QUERIES.IS_NOT_EMPTY},
  ];

  return (
    <>
      <Dropdown
        fieldLabel="Show Query"
        emptyLabel="(choose)"
        options={queryOptions}
        value={queryOptions.find(
          o => o.value === elementAttributes['show-condition']?.query,
        )}
        onValueChange={option =>
          updateAttribute('show-condition.query', option.value)
        }
        keyExtractor={option => option.value}
        labelExtractor={option => option.label}
      />
      <Dropdown
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
        labelExtractor={field => `Check ${field.attributes.name}`}
      />
    </>
  );
}
