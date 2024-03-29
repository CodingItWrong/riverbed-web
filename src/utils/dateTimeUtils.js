import dayjs from 'dayjs';
import {HUMAN_FORMAT as HUMAN_DATE_FORMAT} from './dateUtils';
import now from './now';

const HUMAN_TIME_FORMAT = 'h:mm A';
const HUMAN_FORMAT = `${HUMAN_DATE_FORMAT} ${HUMAN_TIME_FORMAT}`;

const dateTimeUtils = {
  getTime(dateObject) {
    let time = {hour: 0, minute: 0, second: 0, millisecond: 0};
    if (dateObject) {
      const date = dayjs(dateObject);
      if (!date.isValid()) {
        return null;
      }
      time = {
        hour: date.hour(),
        minute: date.minute(),
        second: date.second(),
        millisecond: date.millisecond(),
      };
    }
    return time;
  },
  objectToHumanTimeString(dateObject) {
    return dateObject ? dayjs(dateObject).format(HUMAN_FORMAT) : dateObject;
  },
  objectToServerString(dateObject) {
    if (dateObject?.toISOString) {
      return dateObject.toISOString();
    } else if (!dateObject) {
      return dateObject;
    } else {
      return 'Invalid Date';
    }
  },
  serverStringToHumanString(dateString) {
    return dateString ? dayjs(dateString).format(HUMAN_FORMAT) : dateString;
  },
  serverStringToHumanTimeString(dateString) {
    return dateString
      ? dayjs(dateString).format(HUMAN_TIME_FORMAT)
      : dateString;
  },
  serverStringToObject(dateString) {
    if (!dateString) {
      return dateString;
    }
    const dayjsObject = dayjs(dateString);

    if (!dayjsObject.isValid()) {
      return null;
    }

    return dayjsObject.toDate();
  },
  setDate({oldDateObject, newDateObject}) {
    const time = dateTimeUtils.getTime(oldDateObject);
    return dayjs(newDateObject)
      .hour(time.hour)
      .minute(time.minute)
      .second(time.second)
      .millisecond(time.millisecond)
      .toDate();
  },
  setTime({dateObject, hour, minute}) {
    return dayjs(dateObject || now())
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0)
      .toDate();
  },
};

export default dateTimeUtils;
