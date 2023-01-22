import set from 'lodash.set';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TextField from '../../components/TextField';

export default function EditColumnForm({column, onSave, onDelete, onCancel}) {
  const [attributes, setAttributes] = useState(column.attributes);

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  function handleSave() {
    onSave(attributes);
  }

  return (
    <Card>
      <TextField
        label="Column Name"
        value={attributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-column-name"
      />
      <Button onPress={onCancel} style={styles.button}>
        Cancel
      </Button>
      <Button onPress={onDelete} style={styles.button}>
        Delete Column
      </Button>
      <Button onPress={handleSave} style={styles.button}>
        Save Column
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
});
