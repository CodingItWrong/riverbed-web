import dayjs from 'dayjs';

const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
const HUMAN_FORMAT = 'MMM D, YYYY';

const dateUtils = {
  serverStringToObject(dateString) {
    return dateString ? dayjs(dateString).toDate() : dateString;
  },
  serverStringToHumanString(dateString) {
    return dateString ? dayjs(dateString).format(HUMAN_FORMAT) : dateString;
  },
  objectToServerString(dateObject) {
    return dateObject
      ? dayjs(dateObject).format(SERVER_DATE_FORMAT)
      : dateObject;
  },
};

export default dateUtils;
