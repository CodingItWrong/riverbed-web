import dayjs from 'dayjs';

const HUMAN_FORMAT = 'MMM D, YYYY h:mm:ss A';

const dateUtils = {
  serverStringToHumanString(dateString) {
    return dateString ? dayjs(dateString).format(HUMAN_FORMAT) : dateString;
  },
};

export default dateUtils;
