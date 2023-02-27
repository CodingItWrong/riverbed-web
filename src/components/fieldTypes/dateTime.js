import {View} from 'react-native';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateTimeUtils from '../../utils/dateTimeUtils';
import Text from '../Text';

const dateTimeFieldDataType = {
  key: FIELD_DATA_TYPES.DATETIME.key,
  label: 'Date and Time',
  formatValue: ({value}) => dateTimeUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // datetimes are stored as strings that sort lexicographically
  EditorComponent: DateTimeEditorComponent,
};

function DateTimeEditorComponent({field, value, style}) {
  // TODO: implement writable
  return (
    <View style={style} testID={`field-${field.id}`}>
      <Text>{dateTimeFieldDataType.formatValue({value})}</Text>
    </View>
  );
}

export default dateTimeFieldDataType;
