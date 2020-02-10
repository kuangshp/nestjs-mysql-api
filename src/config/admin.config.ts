const PREFIX = process.env.PREFIX || '/';
export default {
  adminPath: 'admin',
  frontPath: 'front',
  whiteUrl: [`${PREFIX}/login/`, `${PREFIX}/register/`, 'api/v1/admin/goods/upload_image'], // 白名单url
  pageSize: 10, // 一次请求多少条数据
  pageNumber: 1, // 当前第几页
  sessionMaxAge: 30 * 1000 * 60,
  staticPrefixPath: '', // 静态文件的前缀
  supportImgTypes: ['.png', '.jpg', '.gif', '.jpeg'],
  defaultPassword: '123456',
  // 使用jimp处理图片的参数
  jimpSize: [{ width: 100, height: 100 }, { width: 200, height: 200 }, { width: 400, height: 400 }]
}