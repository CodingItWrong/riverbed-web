import dateUtils from '../utils/dateUtils';
import FIELD_DATA_TYPES from './fieldDataTypes';

const VALUES = {
  EMPTY: {
    key: 'EMPTY',
    label: 'Empty',
    call: () => null,
  },
  NOW: {
    key: 'NOW',
    label: 'Now',
    call: dataType => {
      switch (dataType) {
        case FIELD_DATA_TYPES.DATE.key:
          return dateUtils.objectToServerString(new Date());
        case FIELD_DATA_TYPES.DATETIME.key:
          return new Date().toISOString();
        default:
          console.error(`invalid data type for value: ${dataType}`);
      }
    },
  },
};

export default VALUES;
