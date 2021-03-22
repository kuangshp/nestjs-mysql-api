import moment from 'moment';
/**
 * @param dateNum 时间
 * @param isDue 是否显示时分秒
 * @return:
 * @Description: 格式化日期
 * @Author: 水痕
 * @LastEditors: 水痕
 * @Date: 2019-07-31 15:27:39
 */
export const formatDate = (
  dateNum: string | number,
  isDue = false,
): string => {
  if (!dateNum) {
    return '';
  }
  // if (!/^\d+$/.test(dateNum.toString())) {
  //   throw new TypeError(`${dateNum}传递的数据格式化错误`);
  // }
  if (isDue) {
    return moment(dateNum).format('YYYY-MM-DD');
  } else {
    return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
  }
};

/**
 * @Author: 水痕
 * @Date: 2020-02-20 20:51:54
 * @LastEditors: 水痕
 * @Description: 获取年月日时间
 * @param {type} 
 * @return: 
 */
export const getDay = (date: Date = new Date()): string => {
  return moment(date).format('YYYYMMDD');
};

/**
 * @Author: 水痕
 * @Date: 2020-02-20 21:47:49
 * @LastEditors: 水痕
 * @Description: 获取当前的时间鹾
 * @param {type} 
 * @return: 
 */
export const getTime = (): number => {
  return new Date().getTime();
};

/**
 * 根据生日计算年龄
 * @param date 
 */
export const birthdayYear = (date: Date): string | null => {
  try {
    return date ? `${moment().diff(date, 'years')}` : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * @Author: 水痕
 * @Date: 2020-12-15 14:36:48
 * @LastEditors: 水痕
 * @Description: 传递时间距离现在多少毫秒过期
 * @param {string} date 时间格式为:2020-12-15 14:20:10
 * @return {*}
 */
export const dueDateMillisecond = (date: string): number => {
  // 当前时间
  const currentTime = Number.parseInt(String(new Date().getTime() / 1000));
  // 未来时间
  const futureTime = Number.parseInt(String(new Date(date).getTime() / 1000));
  if (futureTime <= currentTime) {
    return 0;
  } else {
    // 这里把秒数转成毫秒
    return (futureTime - currentTime) * 1000;
  }
};