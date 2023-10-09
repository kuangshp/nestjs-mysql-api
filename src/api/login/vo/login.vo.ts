export class LoginVo {
  readonly id!: number; // 账号id
  readonly username?: string; // 用户名
  readonly accountType?: number; // 账号类型:0普通账号,1是主账号,2是超管
  readonly token?: string; // 登录的token
  readonly refreshToken?: string; // 刷新token
  readonly sign!: string; // 签名key
}

export class LoginAccountVo {
  readonly id!: number; // 账号id
  readonly username!: string; // 用户名
  readonly tenantId!: number; // 商户id
  readonly accountType!: number; // 账号类型:0普通账号,1是主账号,2是超管
  readonly status!: number; // 状态0是正常,1是禁用
  readonly password!: string; // 密码
  readonly salt!: string; // 密码盐
}

export class LoginTokenDataVo {
  readonly userInfo!: LoginAccountVo; // 用户基本信息
  readonly sign!: string; // 签名key
}
