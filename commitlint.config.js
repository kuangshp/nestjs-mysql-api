module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['upd', 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
  },
};

/**
 * https://segmentfault.com/a/1190000017790694
 * upd: 更新
 * feat: 新增
 * fix: 修复
 * docs: 文档
 * style: 样式
 * refactor: 重构代码
 * test: 单元测试
 * chore: 构建过程或辅助工具的变动
 */
