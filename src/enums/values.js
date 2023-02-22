import dateTimeUtils from '../utils/dateTimeUtils';
import dateUtils from '../utils/dateUtils';
import FIELD_DATA_TYPES from './fieldDataTypes';

const VALUES = {
  EMPTY: {
    key: 'empty',
    label: 'Empty',
    call: () => null,
  },
  NOW: {
    key: 'now',
    label: 'Now',
    call: dataType => {
      switch (dataType) {
        case FIELD_DATA_TYPES.DATE.key:
          return dateUtils.objectToServerString(new Date());
        case FIELD_DATA_TYPES.DATETIME.key:
          return dateTimeUtils.objectToServerString(new Date());
        default:
          console.error(`invalid data type for value: ${dataType}`);
      }
    },
  },
};

export default VALUES;
