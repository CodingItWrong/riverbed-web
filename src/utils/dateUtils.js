import dayjs from 'dayjs';
import now from './now';

const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
export const HUMAN_FORMAT = 'ddd MMM D, YYYY';

const dateUtils = {
  addDays(dateObject, numDays) {
    return dayjs(dateObject).add(numDays, 'day').toDate();
  },
  isCurrentMonth(dateString) {
    return dateUtils.isMonthOffset(dateString, 0);
  },
  isMonthOffset(dateString, offset) {
    if (!dateString) {
      return false;
    }

    const fieldObj = dayjs(dateString);
    const n = now();
    const nowObj = dayjs(n);

    return (
      fieldObj.year() === nowObj.year() &&
      fieldObj.month() === nowObj.month() + offset
    );
  },
  serverStringToObject(dateString) {
    if (!dateString) {
      return null;
    }
    const dayjsObject = dayjs(dateString);

    if (!dayjsObject.isValid()) {
      return null;
    }

    return dayjsObject.toDate();
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
