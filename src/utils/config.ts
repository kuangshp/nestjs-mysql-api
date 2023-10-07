import { parse } from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

export const IS_DEV = getEnv() === 'dev';
// 读取项目配置
export const getConfig = () => {
  const environment = getEnv();
  console.log(environment, '当前运行的环境');
  const yamlPath = path.join(process.cwd(), `./application.${environment}.yml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};
