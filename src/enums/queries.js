import dateUtils from '../utils/dateUtils';
import VALUES from './values';

const QUERIES = {
  IS_CURRENT_MONTH: {
    key: 'IS_CURRENT_MONTH',
    label: 'Current Month',
    match: v => dateUtils.isCurrentMonth(v),
  },
  IS_EMPTY: {
    key: 'IS_EMPTY',
    label: 'Empty',
    match: v => !v,
  },
  EQUALS_VALUE: {
    key: 'EQUALS_VALUE',
    label: 'Equals Value',
    match: (v, _dataType, options) => v === options?.value,
    showConcreteValueField: true,
  },
  IS_FUTURE: {
    key: 'IS_FUTURE',
    label: 'Future',
    match: (v, dataType) => VALUES.NOW.call(dataType) < v,
  },
  IS_NOT_EMPTY: {
    key: 'IS_NOT_EMPTY',
    label: 'Not Empty',
    match: v => !QUERIES.IS_EMPTY.match(v),
  },
  IS_NOT_FUTURE: {
    key: 'IS_NOT_FUTURE',
    label: 'Not Future',
    match: (v, dataType) => !QUERIES.IS_FUTURE.match(v, dataType),
  },
  IS_NOT_PAST: {
    key: 'IS_NOT_PAST',
    label: 'Not Past',
    match: (v, dataType) => !QUERIES.IS_PAST.match(v, dataType),
  },
  IS_PAST: {
    key: 'IS_PAST',
    label: 'Past',
    match: (v, dataType) => v < VALUES.NOW.call(dataType),
  },
  IS_PREVIOUS_MONTH: {
    key: 'IS_PREVIOUS_MONTH',
    label: 'Previous Month',
    match: v => dateUtils.isMonthOffset(v, -1),
  },
};

export default QUERIES;
