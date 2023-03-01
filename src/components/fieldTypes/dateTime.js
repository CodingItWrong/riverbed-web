import {useState} from 'react';
import {View} from 'react-native';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateTimeUtils from '../../utils/dateTimeUtils';
import dateUtils from '../../utils/dateUtils';
import Button from '../Button';
import sharedStyles from '../sharedStyles';

const dateTimeFieldDataType = {
  key: FIELD_DATA_TYPES.DATETIME.key,
  label: 'Date and Time',
  formatValue: ({value}) => dateTimeUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // datetimes are stored as strings that sort lexicographically
  EditorComponent: DateTimeEditorComponent,
};

const MODAL_SHOWN = {
  NONE: 'NONE',
  DATE: 'DATE',
  TIME: 'TIME',
};

function DateTimeEditorComponent({
  field,
  value,
  setValue,
  onBlur,
  style,
  disabled,
}) {
  const [modalShown, setModalShown] = useState(MODAL_SHOWN.NONE);

  const date = dateUtils.serverStringToObject(value);
  const time = dateTimeUtils.getTime(value);

  function closeModal() {
    setModalShown(MODAL_SHOWN.NONE);
  }

  function handleChangeDate({date: newDateObject}) {
    const result = dateTimeUtils.setDate({
      oldDateObject: date || null,
      newDateObject,
    });
    const resultString = dateTimeUtils.objectToServerString(result);
    setValue(resultString);
    closeModal();
    onBlur?.({[field.id]: resultString});
  }

  function handleChangeTime({hours, minutes}) {
    const resultString = dateTimeUtils.setTime({
      dateObject: date,
      hour: hours,
      minute: minutes,
    });
    setValue(resultString);
    closeModal();
    onBlur?.({[field.id]: resultString});
  }

  // TODO: how to show field label
  return (
    <>
      <View style={[sharedStyles.row, style]}>
        <Button
          style={sharedStyles.fill}
          disabled={disabled}
          onPress={() => setModalShown(MODAL_SHOWN.DATE)}
          testID={`date-input-${field.id}`}
        >
          {value ? dateUtils.serverStringToHumanString(value) : '(date)'}
        </Button>
        <Button
          style={sharedStyles.fill}
          disabled={disabled}
          onPress={() => setModalShown(MODAL_SHOWN.TIME)}
          testID={`time-input-${field.id}`}
        >
          {value
            ? dateTimeUtils.serverStringToHumanTimeString(value)
            : '(time)'}
        </Button>
      </View>
      <DatePickerModal
        mode="single"
        visible={modalShown === MODAL_SHOWN.DATE}
        onDismiss={closeModal}
        date={date}
        onConfirm={handleChangeDate}
      />
      <TimePickerModal
        visible={modalShown === MODAL_SHOWN.TIME}
        onDismiss={closeModal}
        hours={time.hour}
        minutes={time.minute}
        onConfirm={handleChangeTime}
        testID="time-picker-modal"
      />
    </>
  );
}

export default dateTimeFieldDataType;
