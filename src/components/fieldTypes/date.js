import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateUtils from '../../utils/dateUtils';
import sharedStyles from '../sharedStyles';

const dateFieldDataType = {
  key: FIELD_DATA_TYPES.DATE.key,
  label: FIELD_DATA_TYPES.DATE.label,
  formatValue: value => dateUtils.serverStringToHumanString(value),
  getSortValue: value => value, // dates are stored as strings that sort lexicographically
  EditorComponent: DateEditorComponent,
};

function DateEditorComponent({
  field,
  value,
  setValue,
  readOnly,
  disabled,
  style,
}) {
  const {name} = field.attributes;
  return (
    <DatePickerInput
      locale="en"
      label={name}
      value={dateUtils.serverStringToObject(value)}
      onChange={newDate => setValue(dateUtils.objectToServerString(newDate))}
      onChangeText={newText => newText === '' && setValue(newText)}
      disabled={disabled}
      inputMode="start"
      testID={`date-input-${field.id}`}
      style={[sharedStyles.textInput, style]}
    />
  );
}

export default dateFieldDataType;
