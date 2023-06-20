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
  return (
    <DatePicker
      label={label}
      value={dayjs(value)}
      onChange={dayJsObject => {
        const string = dateUtils.objectToServerString(dayJsObject);
        setValue(string);
      }}
      disabled={disabled}
      data-testid={`date-input-${field.id}`}
      style={style}
      slotProps={{
        textField: {
          variant: 'filled',
        },
      }}
    />
  );
}

export default dateFieldDataType;
