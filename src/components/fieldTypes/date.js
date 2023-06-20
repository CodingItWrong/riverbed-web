import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateUtils from '../../utils/dateUtils';

const dateFieldDataType = {
  key: FIELD_DATA_TYPES.DATE.key,
  label: 'Date',
  isTemporal: true,
  isValidValue: value => !!dateUtils.serverStringToObject(value),
  formatValue: ({value}) => dateUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // dates are stored as strings that sort lexicographically
  EditorComponent: DateEditorComponent,
};

function DateEditorComponent({field, label, value, setValue, disabled, style}) {
  console.log({valueObject: dateUtils.serverStringToObject(value)});
  // TODO: should onChangeText always update? Like if you type?
  return (
    <DatePicker
      label={label}
      value={dayjs(value)}
      onChange={dayJsObject => {
        const string = dateUtils.objectToServerString(dayJsObject);
        console.log({string});
        setValue(string);
      }}
      disabled={disabled}
      data-testid={`date-input-${field.id}`}
      style={style}
    />
  );
}

export default dateFieldDataType;
