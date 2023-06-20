import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateTimeUtils from '../../utils/dateTimeUtils';

const dateTimeFieldDataType = {
  key: FIELD_DATA_TYPES.DATETIME.key,
  label: 'Date and Time',
  isTemporal: true,
  isValidValue: value => !!dateTimeUtils.serverStringToObject(value),
  formatValue: ({value}) => dateTimeUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // datetimes are stored as strings that sort lexicographically
  EditorComponent: DateTimeEditorComponent,
};

function DateTimeEditorComponent({
  field,
  label,
  value,
  setValue,
  style,
  disabled,
}) {
  return (
    <DateTimePicker
      label={label}
      value={dayjs(value)}
      onChange={dayJsObject => {
        const string = dateTimeUtils.objectToServerString(dayJsObject);
        setValue(string);
      }}
      disabled={disabled}
      style={style}
      slotProps={{
        textField: {
          variant: 'filled',
          'data-testid': `datetime-input-${field.id}`,
        },
      }}
    />
  );
}

export default dateTimeFieldDataType;
