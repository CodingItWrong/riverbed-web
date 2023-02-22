import dayjs from 'dayjs';

const HUMAN_FORMAT = 'ddd MMM D, YYYY h:mm:ss A';

const dateTimeUtils = {
  objectToServerString(dateObject) {
    return dateObject ? dateObject.toISOString() : dateObject;
  },
  serverStringToHumanString(dateString) {
    return dateString ? dayjs(dateString).format(HUMAN_FORMAT) : dateString;
  },
};

export default dateTimeUtils;
