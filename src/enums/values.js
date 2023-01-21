import dateUtils from '../utils/dateUtils';

const VALUES = {
  EMPTY: {
    key: 'EMPTY',
    label: 'Empty',
    call: () => null,
  },
  NOW: {
    key: 'NOW',
    label: 'Now',
    call: () => dateUtils.objectToServerString(new Date()),
  },
};

export default VALUES;
