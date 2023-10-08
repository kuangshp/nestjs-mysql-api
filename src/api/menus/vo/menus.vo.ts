import { MethodEnum } from '@src/enums/method.enum';

export class MenusVo {
  id!: number;
  title!: string; // 接口标题,或菜单标题
  url!: string; // 接口请求url,或菜单路由
  method!: MethodEnum; // 接口的请求方式
  icon!: string; // 菜单小图标
  sort!: number; // 菜单,或接口排序
  type!: number; // 0目录,1菜单,2接口
  parentId!: number; // 上一级id
  status!: number; // 状态:0是正常,1是禁止
}
