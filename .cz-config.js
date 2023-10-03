module.exports = {
  // 可选类型
  types: [
    {
      value: 'feat',
      name: 'feat: 新功能',
    },
    {
      value: 'fix',
      name: 'fix:修复',
    },
    {
      value: 'docs',
      name: 'docs:文档变更',
    },
    {
      value: 'refactor',
      name: 'refactor:重构(既不添加功能，也不修复bug)',
    },
    {
      value: 'perf',
      name: 'perf: 性能优化',
    },
    {
      value: 'test',
      name: 'test:添加测试',
    },
    {
      value: 'revert',
      name: 'revert:回退',
    },
    {
      value: 'build',
      name: 'build:打包',
    },
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型',
    customScope: '请输入修改的范围(可选)',
    subject: '请简要描素提交(必须)',
    body: '请输入详细描述(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确认要使用以上信息提交?(y/n)',
  },
  // 默认长度
  subjectLimit: 72,
};
