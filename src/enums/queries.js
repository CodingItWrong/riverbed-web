import VALUES from './values';

const QUERIES = {
  IS_EMPTY: {
    key: 'IS_EMPTY',
    label: 'Empty',
    match: v => !v,
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
};

export default QUERIES;
