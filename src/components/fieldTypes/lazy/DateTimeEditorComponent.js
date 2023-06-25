import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import dateTimeUtils from '../../utils/dateTimeUtils';

const DateTimePicker = () => null;

function DateTimeEditorComponent({
  field,
  label,
  value,
  setValue,
  style,
  disabled,
}) {
  return (
    <DateLocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={dayJsObject => {
          const string = dateTimeUtils.objectToServerString(dayJsObject);
          setValue(string);
        }}
        disabled={disabled}
        slotProps={{
          textField: {
            style,
            variant: 'filled',
            'data-testid': `datetime-input-${field.id}`,
          },
        }}
      />
    </DateLocalizationProvider>
  );
}

export default DateTimeEditorComponent;
