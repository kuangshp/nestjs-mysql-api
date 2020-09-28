export const isUuidExp = /\w{8}(-\w{4}){3}-\w{12}/; // 校验是否为uuid
export const isIntExp = /^\d+$/g;

export const isEmailExp = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g; // 判断邮箱的正则
export const isMobileExp = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/; // 判断手机号码的正则
export const isNameExp = /^[0-9a-zA-Z\u4E00-\u9FA5]{3,10}$/g; // 校验用户名,支持中文、字母、数字
