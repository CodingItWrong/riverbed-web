import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import Text from './Text';
import TextField from './TextField';

// TODO: wrap

export default function FieldInput({field, value, setValue, style}) {
  switch (field.attributes['data-type']) {
    case FIELD_DATA_TYPES.text:
      return (
        <TextField
          key={field.id}
          label={field.attributes.name}
          testID={`text-input-${field.id}`}
          value={value ?? ''}
          onChangeText={setValue}
          style={style}
        />
      );
    case FIELD_DATA_TYPES.date:
      return (
        <DatePickerInput
          locale="en"
          label={field.attributes.name}
          value={dateUtils.serverStringToObject(value)}
          onChange={newDate =>
            setValue(dateUtils.objectToServerString(newDate))
          }
          inputMode="start"
          testID={`date-input-${field.id}`}
          style={style}
        />
      );
    default:
      return <Text>ERROR: unknown field data type {field['data-type']}</Text>;
  }
}
