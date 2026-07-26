import {DateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import dateTimeUtils from '../../../utils/dateTimeUtils';

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
        // TODO: remove before upgrading to x-date-pickers v9; the accessible
        // field DOM structure is the v8 default and this opts back out of it.
        enableAccessibleFieldDOMStructure={false}
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
