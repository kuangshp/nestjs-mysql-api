import { Injectable } from '@nestjs/common';
import Redis, { ClientContext, Result } from 'ioredis';

import { ObjectType } from '@src/types';
import { isObject } from '@src/utils';

@Injectable()
export class RedisService {
  public redisClient!: Redis;

  // 模块加载的时候就缓存创建redis句柄
  onModuleInit() {
    if (!this.redisClient) {
      this.getClient();
    }
  }

  private getClient() {
    this.redisClient = new Redis({
      port: 6379, // Redis port
      host: 'localhost', // redisDb Redis host
      username: '', // needs Redis >= 6
      password: '', // 密码
      db: 0, // redis是几个数据库的，使用第一个
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-11 11:25:54
   * @LastEditors: 水痕
   * @Description: 设置值到redis中
   * @param {string} key
   * @param {any} value
   * @param {number} second 过期时间秒
   * @return {*}
   */
  public async set(key: string, value: unknown): Promise<Result<'OK', ClientContext>>;
  public async set(
    key: string,
    value: unknown,
    second: number
  ): Promise<Result<'OK', ClientContext>>;
  public async set(key: string, value: any, second?: number): Promise<Result<'OK', ClientContext>> {
    value = isObject(value) ? JSON.stringify(value) : value;
    if (!second) {
      return await this.redisClient.set(key, value);
    } else {
      return await this.redisClient.set(key, value, 'EX', second);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-11 11:38:29
   * @LastEditors: 水痕
   * @Description: 设置自动 +1
   * @param {string} key
   * @return {*}
   */
  public async incr(key: string): Promise<Result<number, ClientContext>> {
    return await this.redisClient.incr(key);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:55:14
   * @LastEditors: 水痕
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<Result<string | null, ClientContext>> {
    try {
      const data = await this.redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      } else {
        return null;
      }
    } catch (e) {
      return await this.redisClient.get(key);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-11 11:41:57
   * @LastEditors: 水痕
   * @Description: 根据key删除redis缓存数据
   * @param {string} key
   * @return {*}
   */
  public async del(key: string): Promise<Result<number, ClientContext>> {
    return await this.redisClient.del(key);
  }

  async hset(key: string, field: ObjectType): Promise<Result<number, ClientContext>> {
    return await this.redisClient.hset(key, field);
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-13 14:01:40
   * @LastEditors: 水痕
   * @Description: 获取单一个值
   * @param {string} key
   * @param {string} field
   * @return {*}
   */
  async hget(key: string, field: string): Promise<Result<string | null, ClientContext>> {
    return await this.redisClient.hget(key, field);
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-13 13:59:55
   * @LastEditors: 水痕
   * @Description: 获取全部的hget的
   * @param {string} key
   * @return {*}
   */
  async hgetall(key: string): Promise<Result<Record<string, string>, ClientContext>> {
    return await this.redisClient.hgetall(key);
  }

  /**
   * @Author: 水痕
   * @Date: 2022-08-11 11:42:07
   * @LastEditors: 水痕
   * @Description: 清空redis的缓存
   * @return {*}
   */
  public async flushall(): Promise<Result<'OK', ClientContext>> {
    return await this.redisClient.flushall();
  }
}
