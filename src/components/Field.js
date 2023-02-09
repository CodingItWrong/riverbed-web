import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import FormattedValue from './FormattedValue';
import NumberField from './NumberField';
import Text from './Text';
import TextField from './TextField';
import sharedStyles from './sharedStyles';

// TODO: wrap

export default function Field({
  field,
  value,
  readOnly,
  disabled,
  setValue,
  style,
}) {
  const {name, 'data-type': dataType, options} = field.attributes;

  if (readOnly) {
    return (
      <FormattedValue
        value={value}
        dataType={dataType}
        testID={`field-${field.id}`}
      />
    );
  }

  switch (dataType) {
    case FIELD_DATA_TYPES.DATE.key:
      return (
        <DatePickerInput
          locale="en"
          label={name}
          value={dateUtils.serverStringToObject(value)}
          onChange={newDate =>
            setValue(dateUtils.objectToServerString(newDate))
          }
          onChangeText={newText => newText === '' && setValue(newText)}
          disabled={disabled}
          inputMode="start"
          testID={`date-input-${field.id}`}
          style={[sharedStyles.textInput, style]}
        />
      );
    case FIELD_DATA_TYPES.DATETIME.key:
      // TODO: implement writable
      return <FormattedValue value={value} dataType={dataType} />;
    case FIELD_DATA_TYPES.NUMBER.key:
      return (
        <NumberField
          key={field.id}
          label={name}
          testID={`number-input-${field.id}`}
          value={value ?? ''}
          onChangeText={setValue}
          disabled={disabled}
          style={style}
        />
      );
    case FIELD_DATA_TYPES.TEXT.key:
      return (
        <TextField
          key={field.id}
          label={name}
          testID={`text-input-${field.id}`}
          value={value ?? ''}
          onChangeText={setValue}
          disabled={disabled}
          multiline={options.multiline}
          style={style}
        />
      );
    default:
      return <Text>ERROR: unknown data type {dataType}</Text>;
  }
}
