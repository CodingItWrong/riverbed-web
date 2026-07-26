import {DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import dateUtils from '../../../utils/dateUtils';

function DateEditorComponent({field, label, value, setValue, disabled, style}) {
  return (
    <DateLocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={dayJsObject => {
          if (!dayJsObject || dayJsObject.isValid()) {
            const string = dateUtils.objectToServerString(dayJsObject);
            setValue(string);
          }
        }}
        disabled={disabled}
        slotProps={{
          textField: {
            variant: 'filled',
            style,
            // on the field root, not the input: the accessible field DOM
            // structure renders the editable sections as spans and keeps only
            // a visually hidden input for form interop.
            'data-testid': `date-input-${field.id}`,
          },
        }}
      />
    </DateLocalizationProvider>
  );
}

export default DateEditorComponent;
