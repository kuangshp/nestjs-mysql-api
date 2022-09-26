import { QueryVo } from '@src/shared/vo/query.vo';

export class LoginVo extends QueryVo {
  mobile?: string; // 账号绑定的手机号码
  email?: string; // 账号绑定的邮箱
  username?: string; // 用户名
  isSuper?: number; // 是否为超级管理员：1表示是,0表示不是
  isSuperStr?: string; // 是否为超级管理员的翻译
  token?: string; // 登录的token
}
