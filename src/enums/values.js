import dateTimeUtils from '../utils/dateTimeUtils';
import dateUtils from '../utils/dateUtils';
import now from '../utils/now';
import FIELD_DATA_TYPES from './fieldDataTypes';

const VALUES = {
  EMPTY: {
    key: 'empty',
    label: 'empty',
    call: () => null,
  },
  NOW: {
    key: 'now',
    label: 'now',
    call: dataType => {
      switch (dataType) {
        case FIELD_DATA_TYPES.DATE.key:
          return dateUtils.objectToServerString(now());
        case FIELD_DATA_TYPES.DATETIME.key:
          return dateTimeUtils.objectToServerString(now());
        case FIELD_DATA_TYPES.TEXT.key:
          return dateTimeUtils.objectToHumanTimeString(now());
        default:
          console.error(`VALUES.NOW is not valid for data type "${dataType}"`);
          return null;
      }
    },
  },
  SPECIFIC_VALUE: {
    key: 'specific_value',
    label: 'specific value',
    call: (_dataType, elementOptions) =>
      elementOptions['initial-specific-value'],
  },
};

export default VALUES;
