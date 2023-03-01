import {DatePickerInput} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateUtils from '../../utils/dateUtils';
import sharedStyles from '../sharedStyles';

const dateFieldDataType = {
  key: FIELD_DATA_TYPES.DATE.key,
  label: 'Date',
  formatValue: ({value}) => dateUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // dates are stored as strings that sort lexicographically
  EditorComponent: DateEditorComponent,
};

function DateEditorComponent({
  field,
  value,
  setValue,
  onBlur,
  readOnly,
  disabled,
  style,
}) {
  const {name} = field.attributes;

  // TODO: should onChangeText always update? Like if you type?
  return (
    <DatePickerInput
      locale="en"
      label={name}
      value={dateUtils.serverStringToObject(value)}
      onChange={newDate => {
        const newValue = dateUtils.objectToServerString(newDate);
        setValue(newValue);
        onBlur?.({[field.id]: newValue});
      }}
      onChangeText={newText => {
        if (newText === '') {
          setValue(newText);
          onBlur?.({[field.id]: newText});
        }
      }}
      onBlur={() => onBlur()}
      disabled={disabled}
      inputMode="start"
      testID={`date-input-${field.id}`}
      style={[sharedStyles.textInput, style]}
    />
  );
}

export default dateFieldDataType;
