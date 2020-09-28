import { Injectable } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';

@Injectable()
export class RedisCacheService extends RedisClientService {

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:53:37
   * @LastEditors: 水痕
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值 
   * @param value {String} key的值 
   * @param second {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, second?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!this.client) {
      this.getClient();
    }
    if (!second) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', second);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-17 14:55:14
   * @LastEditors: 水痕
   * @Description: 设置获取redis缓存中的值
   * @param key {String} 
   */
  public async get(key: string): Promise<any> {
    if (!this.client) {
      this.getClient();
    }
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
    if (!this.client) {
      this.getClient();
    }
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
    if (!this.client) {
      this.getClient();
    }
    await this.client.flushall();
  }
}
