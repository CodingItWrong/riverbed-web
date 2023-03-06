import dateTimeUtils from '../utils/dateTimeUtils';
import dateUtils from '../utils/dateUtils';

const FIELD_DATA_TYPES = {
  CHOICE: {
    key: 'choice',
  },
  DATE: {
    key: 'date',
    isTemporal: true,
    isValidValue: value => !!dateUtils.serverStringToObject(value),
  },
  DATETIME: {
    key: 'datetime',
    isTemporal: true,
    isValidValue: value => !!dateTimeUtils.serverStringToObject(value),
  },
  GEOLOCATION: {
    key: 'geolocation',
  },
  NUMBER: {
    key: 'number',
  },
  TEXT: {
    key: 'text',
  },
};

export default FIELD_DATA_TYPES;
