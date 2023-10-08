/**项目前缀 */
export const ADMIN_PREFIX = 'admin';
/** redis中存储token前缀 */
export const TOKEN_PREFIX = 'account_login_token';
export const TOKEN_REFRESH_PREFIX = 'account_login_refresh_token';

export * from './redis.cache';
export * from './redis.limit';
export * from './reg';
