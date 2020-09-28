import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisClientService {
  public client: Redis;
  constructor (
    private redisService: RedisService
  ) { }

  onModuleInit() {
    this.getClient();
  }

  public getClient() {
    this.client = this.redisService.getClient();
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 10:28:36
   * @LastEditors: 水痕
   * @Description: 设置redis存储
   * @param {type} 
   * @return: 
   */
  public async set(key: string, value: object | string, second?: number) {
    value = JSON.stringify(value);
    // 如果没有传递时间就默认时间
    if (!second) {
      await this.client.setex(key, 24 * 60 * 60, value); // 秒为单位
    } else {
      await this.client.set(key, value, 'EX', second);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 10:28:50
   * @LastEditors: 水痕
   * @Description: 获取redis存储
   * @param {type} 
   * @return: 
   */
  public async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:58:12
   * @LastEditors: 水痕
   * @Description: 根据key删除redis缓存数据
   * @param key {String}  
   * @return: 
   */
  public async del(key: string): Promise<any> {
    await this.client.del(key);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 15:49:34
   * @LastEditors: 水痕
   * @Description: 清空redis的缓存
   * @param {type} 
   * @return: 
   */
  public async flushall(): Promise<any> {
    await this.client.flushall();
  }
}
