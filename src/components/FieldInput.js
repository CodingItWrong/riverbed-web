import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../fieldDataTypes';
import Text from './Text';
import TextField from './TextField';

// TODO: wrap

export default function FieldInput({field, value, setValue}) {
  console.log('FieldInput', {field, value});
  switch (field.attributes['data-type']) {
    case FIELD_DATA_TYPES.text:
      return (
        <TextField
          key={field.id}
          label={field.attributes.name}
          testID={`text-input-${field.attributes.name}`}
          value={value ?? ''}
          onChangeText={setValue}
        />
      );
    case FIELD_DATA_TYPES.datetime:
      return (
        <DatePickerInput
          locale="en"
          label={field.attributes.name}
          value={new Date(value)}
          onChange={setValue}
          inputMode="start"
        />
      );
    default:
      return <Text>ERROR: unknown field data type {field['data-type']}</Text>;
  }
}
