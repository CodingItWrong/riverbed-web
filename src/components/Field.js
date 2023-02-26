import {View} from 'react-native';
import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import formatValue from '../utils/formatValue';
import DropdownField from './DropdownField';
import NumberField from './NumberField';
import Text from './Text';
import textFieldDataType from './fieldTypes/text';
import sharedStyles from './sharedStyles';

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
    let textToShow = formatValue({value, dataType, options});

    if (options['show-label-when-read-only']) {
      textToShow = `${name}: ${textToShow ?? '(empty)'}`;
    }

    return (
      <View style={style} testID={`field-${field.id}`}>
        <Text>{textToShow}</Text>
      </View>
    );
  }

  switch (dataType) {
    case FIELD_DATA_TYPES.CHOICE.key:
      return (
        <DropdownField
          fieldLabel={name}
          emptyLabel="(choose)"
          value={options.choices?.find(c => c.id === value)}
          onValueChange={choice => setValue(choice?.id)}
          options={options.choices}
          keyExtractor={choice => choice.id}
          labelExtractor={choice => choice.label}
          disabled={disabled}
          style={style}
        />
      );
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
      return (
        <View style={style} testID={`field-${field.id}`}>
          <Text>{formatValue({value, dataType})}</Text>
        </View>
      );
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
      const {EditorComponent} = textFieldDataType;
      return (
        <EditorComponent
          field={field}
          value={value ?? ''}
          setValue={setValue}
          disabled={disabled}
          style={style}
        />
      );
    default:
      return <Text>ERROR: unknown data type {dataType}</Text>;
  }
}
