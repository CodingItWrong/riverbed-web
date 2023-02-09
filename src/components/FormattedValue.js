import {View} from 'react-native';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateTimeUtils from '../utils/dateTimeUtils';
import dateUtils from '../utils/dateUtils';
import Text from './Text';

// TODO: replace Field readonly mode with this
export default function FormattedValue({value, dataType, style}) {
  function formatValue() {
    switch (dataType) {
      case FIELD_DATA_TYPES.DATE.key:
        return dateUtils.serverStringToHumanString(value);
      case FIELD_DATA_TYPES.DATETIME.key:
        return dateTimeUtils.serverStringToHumanString(value);
      case FIELD_DATA_TYPES.NUMBER.key:
        return value;
      case FIELD_DATA_TYPES.TEXT.key:
        return value?.trim();
      default:
        return `ERROR: unknown data type ${dataType}`;
    }
  }

  return (
    <View style={style}>
      <Text>{formatValue()}</Text>
    </View>
  );
}
