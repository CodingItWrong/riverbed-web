import {View} from 'react-native';
import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import Text from './Text';
import TextField from './TextField';
import sharedStyles from './sharedStyles';

// TODO: wrap

export default function Field({field, value, readOnly, setValue, style}) {
  const {name, 'data-type': dataType} = field.attributes;

  switch (dataType) {
    case FIELD_DATA_TYPES.DATE.key:
      if (readOnly) {
        return (
          <View style={style}>
            <Text>{dateUtils.serverStringToHumanString(value)}</Text>
          </View>
        );
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
    case FIELD_DATA_TYPES.NUMBER.key:
      if (readOnly) {
        return (
          <View style={style} testID={`field-${field.id}`}>
            <Text>{value}</Text>
          </View>
        );
      } else {
        function setValueStringAsNumber(valueString) {
          // TODO: this fails when adding a single decimal; need to use react-number-format
          const valueNumber = parseInt(valueString, 10);
          if (!isNaN(valueNumber)) {
            setValue(valueNumber);
          }
        }
        return (
          <>
            <TextField
              keyboardType="decimal-pad"
              key={field.id}
              label={name}
              testID={`number-input-${field.id}`}
              value={value ?? ''}
              onChangeText={setValueStringAsNumber}
              style={style}
            />
          </>
        );
      }
    case FIELD_DATA_TYPES.TEXT.key:
      if (readOnly) {
        return (
          <View style={style} testID={`field-${field.id}`}>
            <Text>{value}</Text>
          </View>
        );
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
    default:
      return <Text>ERROR: unknown field data type {dataType}</Text>;
  }
}
