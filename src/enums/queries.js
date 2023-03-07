const QUERIES = {
  CONTAINS: {
    key: 'CONTAINS',
    label: 'contains',
  },
  DOES_NOT_CONTAIN: {
    key: 'DOES_NOT_CONTAIN',
    label: 'does not contain',
  },
  IS_CURRENT_MONTH: {
    key: 'IS_CURRENT_MONTH',
    label: 'current month',
  },
  IS_EMPTY: {
    key: 'IS_EMPTY',
    label: 'empty',
  },
  IS_EMPTY_OR_EQUALS: {
    key: 'IS_EMPTY_OR_EQUALS',
    label: 'empty or equals',
    showConcreteValueField: true,
  },
  EQUALS_VALUE: {
    key: 'EQUALS_VALUE',
    label: 'equals value',
    showConcreteValueField: true,
  },
  IS_FUTURE: {
    key: 'IS_FUTURE',
    label: 'future',
  },
  IS_NOT_CURRENT_MONTH: {
    key: 'IS_NOT_CURRENT_MONTH',
    label: 'not current month',
  },
  IS_NOT_EMPTY: {
    key: 'IS_NOT_EMPTY',
    label: 'not empty',
  },
  IS_NOT_FUTURE: {
    key: 'IS_NOT_FUTURE',
    label: 'not future',
  },
  IS_NOT_PAST: {
    key: 'IS_NOT_PAST',
    label: 'not past',
  },
  IS_PAST: {
    key: 'IS_PAST',
    label: 'past',
  },
  IS_PREVIOUS_MONTH: {
    key: 'IS_PREVIOUS_MONTH',
    label: 'previous month',
  },
};

export default QUERIES;
