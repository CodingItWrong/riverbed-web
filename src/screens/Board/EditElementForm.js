import {useMutation, useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Dropdown from '../../components/DropdownField';
import LabeledCheckbox from '../../components/LabeledCheckbox';
import Text from '../../components/Text';
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

  return (
    <Card style={style}>
      <TextField
        label="Field Name"
        value={elementAttributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-element-name"
      />
      {elementAttributes['element-type'] === ELEMENT_TYPES.FIELD.key && (
        <>
          <Dropdown
            fieldLabel="Data Type"
            emptyLabel="(choose)"
            value={dataTypeOptions.find(
              o => o.key === elementAttributes['data-type'],
            )}
            onValueChange={option => updateAttribute('data-type', option.key)}
            options={dataTypeOptions}
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
        </>
      )}
      {elementAttributes['element-type'] === ELEMENT_TYPES.BUTTON.key && (
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

function ActionInputs({elementAttributes, updateAttribute, fields}) {
  const commands = Object.values(COMMANDS);
  const valueOptions = Object.values(VALUES);

  return (
    <Card style={sharedStyles.mt}>
      <Text>Click Action</Text>
      <Dropdown
        fieldLabel="Command"
        emptyLabel="(choose)"
        options={commands}
        value={commands.find(c => c.key === elementAttributes.action?.command)}
        onValueChange={command =>
          updateAttribute('action.command', command.key)
        }
        style={sharedStyles.mt}
      />
      <Dropdown
        fieldLabel="Action Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === elementAttributes.action?.field)}
        onValueChange={field => updateAttribute('action.field', field.id)}
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
      <Dropdown
        fieldLabel="Value"
        emptyLabel="(choose)"
        options={valueOptions}
        value={valueOptions.find(
          o => o.key === elementAttributes.action?.value,
        )}
        onValueChange={option => updateAttribute('action.value', option.key)}
        style={sharedStyles.mt}
      />
    </Card>
  );
}

function ShowConditionInputs({elementAttributes, updateAttribute, fields}) {
  const queryOptions = Object.values(QUERIES);

  return (
    <Card style={sharedStyles.mt}>
      <Text>Show Condition</Text>
      <Dropdown
        fieldLabel="Show Query"
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
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
    </Card>
  );
}
