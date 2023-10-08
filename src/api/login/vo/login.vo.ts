export class LoginVo {
  readonly id!: number; // 账号id
  readonly username?: string; // 用户名
  readonly accountType?: number; // 账号类型:0普通账号,1是主账号,2是超管
  readonly token?: string; // 登录的token
}
