import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatToIST = (gmtDateString) => {
  return dayjs.utc(gmtDateString).add(5, 'hour').add(30, 'minute').format('MMM DD, YYYY hh:mm A');
};
