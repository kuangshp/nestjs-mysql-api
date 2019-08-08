const PREFIX = process.env.PREFIX || '/';

export default {
  whiteUrl: [`${PREFIX}/login/`, `${PREFIX}/register/`], // 白名单url
  pageSize: 10, // 一次请求多少条数据
  pageNumber: 1, // 当前第几页
};
