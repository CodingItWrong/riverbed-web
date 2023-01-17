import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import Text from './Text';
import TextField from './TextField';
import sharedStyles from './sharedStyles';

// TODO: wrap

export default function Field({field, value, readOnly, setValue, style}) {
  const {name, 'data-type': dataType} = field.attributes;

  switch (dataType) {
    case FIELD_DATA_TYPES.text:
      if (readOnly) {
        return <Text>{value}</Text>;
      } else {
        return (
          <TextField
            key={field.id}
            label={name}
            testID={`text-input-${field.id}`}
            value={value ?? ''}
            onChangeText={setValue}
            style={style}
          />
        );
      }
    case FIELD_DATA_TYPES.date:
      if (readOnly) {
        return <Text>{dateUtils.serverStringToHumanString(value)}</Text>;
      } else {
        return (
          <DatePickerInput
            locale="en"
            label={name}
            value={dateUtils.serverStringToObject(value)}
            onChange={newDate =>
              setValue(dateUtils.objectToServerString(newDate))
            }
            inputMode="start"
            testID={`date-input-${field.id}`}
            style={[sharedStyles.textInput, style]}
          />
        );
      }
    default:
      return <Text>ERROR: unknown field data type {dataType}</Text>;
  }
}
