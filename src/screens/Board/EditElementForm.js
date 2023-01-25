import {useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Dropdown from '../../components/Dropdown';
import LabeledCheckbox from '../../components/LabeledCheckbox';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
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
}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD,
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

  function handleSave() {
    onSave(elementAttributes);
  }

  return (
    <Card>
      <TextField
        label="Field Name"
        value={elementAttributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-element-name"
      />
      {elementAttributes['element-type'] === ELEMENT_TYPES.FIELD && (
        <>
          <Dropdown
            fieldLabel="Data Type"
            emptyLabel="(choose)"
            value={dataTypeOptions.find(
              o => o.key === elementAttributes['data-type'],
            )}
            onValueChange={option => updateAttribute('data-type', option.key)}
            options={dataTypeOptions}
            style={styles.field}
          />
          <LabeledCheckbox
            label="Show in Summary"
            checked={elementAttributes['show-in-summary']}
            onChangeChecked={newChecked =>
              updateAttribute('show-in-summary', newChecked)
            }
            style={styles.field}
            testID="checkbox-show-in-summary"
          />
          <LabeledCheckbox
            label="Read-Only"
            checked={elementAttributes['read-only']}
            onChangeChecked={newChecked =>
              updateAttribute('read-only', newChecked)
            }
            style={styles.field}
            testID="checkbox-read-only"
          />
        </>
      )}
      {elementAttributes['element-type'] === ELEMENT_TYPES.BUTTON && (
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
      <Button onPress={onCancel} style={styles.button}>
        Cancel
      </Button>
      <Button onPress={onDelete} style={styles.button}>
        Delete Element
      </Button>
      <Button onPress={handleSave} style={styles.button}>
        Save Element
      </Button>
    </Card>
  );
}

function ActionInputs({elementAttributes, updateAttribute, fields}) {
  const commands = Object.values(COMMANDS);
  const valueOptions = Object.values(VALUES);

  return (
    <Card>
      <Text>Click Action</Text>
      <Dropdown
        fieldLabel="Command"
        emptyLabel="(choose)"
        options={commands}
        value={commands.find(c => c.key === elementAttributes.action?.command)}
        onValueChange={command =>
          updateAttribute('action.command', command.key)
        }
        style={styles.field}
      />
      <Dropdown
        fieldLabel="Action Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === elementAttributes.action?.field)}
        onValueChange={field => updateAttribute('action.field', field.id)}
        keyExtractor={field => field.id}
        labelExtractor={field => `In ${field.attributes.name}`}
        style={styles.field}
      />
      <Dropdown
        fieldLabel="Value"
        emptyLabel="(choose)"
        options={valueOptions}
        value={valueOptions.find(
          o => o.key === elementAttributes.action?.value,
        )}
        onValueChange={option => updateAttribute('action.value', option.key)}
        style={styles.field}
      />
    </Card>
  );
}

function ShowConditionInputs({elementAttributes, updateAttribute, fields}) {
  const queryOptions = Object.values(QUERIES);

  return (
    <Card>
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
        style={styles.field}
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
        style={styles.field}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
});
