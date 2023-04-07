import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateUtils from '../../utils/dateUtils';
import sharedStyles from '../sharedStyles';

const dateFieldDataType = {
  key: FIELD_DATA_TYPES.DATE.key,
  label: 'Date',
  isTemporal: true,
  isValidValue: value => !!dateUtils.serverStringToObject(value),
  formatValue: ({value}) => dateUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // dates are stored as strings that sort lexicographically
  EditorComponent: DateEditorComponent,
};

function DateEditorComponent({
  field,
  label,
  value,
  setValue,
  readOnly,
  disabled,
  style,
}) {
  // TODO: should onChangeText always update? Like if you type?
  return (
    <DatePickerInput
      locale="en"
      label={label}
      value={dateUtils.serverStringToObject(value)}
      onChange={newDate => setValue(dateUtils.objectToServerString(newDate))}
      onChangeText={newText => {
        if (newText === '') {
          setValue(newText);
        }
      }}
      disabled={disabled}
      inputMode="start"
      testID={`date-input-${field.id}`}
      style={[sharedStyles.textInput, style]}
    />
  );
}

export default dateFieldDataType;
