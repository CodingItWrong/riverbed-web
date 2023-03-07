import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import QUERIES_ENUM from '../enums/queries';
import VALUES from '../enums/values';
import dateUtils from '../utils/dateUtils';

function getDataTypeConfig(dataType) {
  return Object.values(FIELD_DATA_TYPES).find(t => t.key === dataType);
}

const QUERIES = {
  [QUERIES_ENUM.IS_CURRENT_MONTH.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      return dateUtils.isCurrentMonth(v);
    },
  },
  [QUERIES_ENUM.IS_EMPTY.key]: {
    match: v => !v,
  },
  [QUERIES_ENUM.IS_EMPTY_OR_EQUALS.key]: {
    match: (...args) =>
      QUERIES.IS_EMPTY.match(...args) || QUERIES.EQUALS_VALUE.match(...args),
    showConcreteValueField: true,
  },
  [QUERIES_ENUM.EQUALS_VALUE.key]: {
    match: (v, _dataType, options) => v === options?.value,
    showConcreteValueField: true,
  },
  [QUERIES_ENUM.IS_FUTURE.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      if (!getDataTypeConfig(dataType)?.isValidValue(v)) {
        return false;
      }

      return VALUES.NOW.call(dataType) < v;
    },
  },
  [QUERIES_ENUM.IS_NOT_CURRENT_MONTH.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      return !QUERIES.IS_CURRENT_MONTH.match(v, dataType);
    },
  },
  [QUERIES_ENUM.IS_NOT_EMPTY.key]: {
    match: v => !QUERIES.IS_EMPTY.match(v),
  },
  [QUERIES_ENUM.IS_NOT_FUTURE.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      return !QUERIES.IS_FUTURE.match(v, dataType);
    },
  },
  [QUERIES_ENUM.IS_NOT_PAST.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      return !QUERIES.IS_PAST.match(v, dataType);
    },
  },
  [QUERIES_ENUM.IS_PAST.key]: {
    match: (v, dataType) => {
      if (!getDataTypeConfig(dataType)?.isTemporal) {
        return false;
      }

      if (!getDataTypeConfig(dataType)?.isValidValue(v)) {
        return false;
      }

      if (!v) {
        return false;
      }

      return v < VALUES.NOW.call(dataType);
    },
  },
  [QUERIES_ENUM.IS_PREVIOUS_MONTH.key]: {
    match: v => dateUtils.isMonthOffset(v, -1),
  },
};

export default QUERIES;
