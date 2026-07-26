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
        // TODO: remove before upgrading to x-date-pickers v9; the accessible
        // field DOM structure is the v8 default and this opts back out of it.
        enableAccessibleFieldDOMStructure={false}
        slotProps={{
          textField: {
            variant: 'filled',
            style,
            inputProps: {
              'data-testid': `date-input-${field.id}`,
            },
          },
        }}
      />
    </DateLocalizationProvider>
  );
}

export default DateEditorComponent;
