import dayjs from 'dayjs';
import {Text} from 'react-native-paper';
import FIELD_DATA_TYPES from '../fieldDataTypes';

export default function FieldDisplay({field, value}) {
  switch (field.attributes['data-type']) {
    case FIELD_DATA_TYPES.text:
      return <Text>{value}</Text>;
    case FIELD_DATA_TYPES.datetime:
      return <Text>{dayjs(value).tz('GMT').format('MMM D, YYYY h:mm a')}</Text>;
    default:
      return <Text>ERROR: unknown field data type {field['data-type']}</Text>;
  }
}
