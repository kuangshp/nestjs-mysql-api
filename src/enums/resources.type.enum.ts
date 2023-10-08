/** 是否为模块:0,菜单:1,按钮(接口):2 */
export enum ResourcesTypeEnum {
  /** 模块 */
  MODULE = 0,
  /** 菜单 */
  MENUS = 1,
  /**接口 */
  API = 2,
}

/** 状态描素 */
export const ResourcesTypeMessage = {
  0: '模块',
  1: '菜单',
  2: '接口',
};
