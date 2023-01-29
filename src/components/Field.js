import {View} from 'react-native';
import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateTimeUtils from '../utils/dateTimeUtils';
import dateUtils from '../utils/dateUtils';
import NumberField from './NumberField';
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
    case FIELD_DATA_TYPES.DATETIME.key:
      // TODO: implement writable
      return (
        <View style={style}>
          <Text>{dateTimeUtils.serverStringToHumanString(value)}</Text>
        </View>
      );
    case FIELD_DATA_TYPES.NUMBER.key:
      if (readOnly) {
        return (
          <View style={style} testID={`field-${field.id}`}>
            <Text>{value}</Text>
          </View>
        );
      } else {
        return (
          <NumberField
            key={field.id}
            label={name}
            testID={`number-input-${field.id}`}
            value={value ?? ''}
            onChangeText={setValue}
            style={style}
          />
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
