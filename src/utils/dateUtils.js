import dayjs from 'dayjs';

const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
const HUMAN_FORMAT = 'ddd MMM D, YYYY';

const dateUtils = {
  isCurrentMonth(dateString) {
    return dateUtils.isMonthOffset(dateString, 0);
  },
  isMonthOffset(dateString, offset) {
    if (!dateString) {
      return true; // should this be the default?
    }

    const fieldObj = dayjs(dateString);
    const nowObj = dayjs();

    return (
      fieldObj.year() === nowObj.year() &&
      fieldObj.month() === nowObj.month() + offset
    );
  },
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
