const QUERIES = {
  IS_EMPTY: {key: 'IS_EMPTY', label: 'Empty', match: v => !v},
  IS_NOT_EMPTY: {key: 'IS_NOT_EMPTY', label: 'Not Empty', match: v => !!v},
};

export default QUERIES;
