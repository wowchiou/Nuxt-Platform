import moment from 'moment';

type Time = string | number | Date;

const weekNumber = ['日', '一', '二', '三', '四', '五', '六'];

export const dayWeek = (time: Time, timePattern: string) => {
  return weekNumber[moment(time, timePattern).day()];
};
