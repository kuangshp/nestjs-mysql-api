export default {
  smsParams: {
    ipLimit: 10, // 条数
    deviceLimit: 10,
    timeLimit: 15, // 15分钟
    dayLimit: 4, // 一天只能发送4条
    numLength: 4, // 验证码数字长度
  },
  // 短信的白名单
  mobileSmsWhiteList: ['', '']
}