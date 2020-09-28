import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as _ from 'lodash';
import { Redis } from 'ioredis';
// https://segmentfault.com/a/1190000012843457
// 注意点这使用发布定订阅的方式必须创建2个redis的连接

@Injectable()
export class RedisDelayService implements OnModuleInit {
  private client: Redis; // 发布的
  private sub: Redis; // 订阅的


  // 任务处理器的map
  private handlers = {};
  // 事件类型的map
  private events = {};
  // 任务列表
  private eventKeyPrefix = 'custom_event_';
  private jobs = {};

  constructor (private redisService: RedisService) { }

  onModuleInit() {
    this.getClient();
  }

  /**
   * @Author: 水痕
   * @Date: 2020-04-14 10:36:20
   * @LastEditors: 水痕
   * @Description: 用户注册事件
   * @param type {String} 事件的类型
   * @param handler {Function} 事件的回调方法
   * @return: 
   */
  public registerEventHandler(type: string, handler: Function): void {
    if (!_.isFunction(handler)) {
      throw new TypeError(`${handler}必须是一个函数`);
    }
    this.handlers[type] = handler;
    this.events[type] = true;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-04-14 10:37:19
   * @LastEditors: 水痕
   * @Description: 添加到延迟任务中
   * @param type {String}类型
   * @param id {Number}id
   * @param body {Object}内容体
   * @param delay {number}过期时间，单位是秒，默认是30分钟
   * @return: 
   */
  public addDelayEvent(type: string, id: number | string, body = {}, delay = 30 * 60): void {
    if (!this.client) {
      this.getClient();
    }
    const key = `${this.eventKeyPrefix}${type}_${id}`;
    const jobKey = `${type}_${id}`;
    this.client.setex(key, delay, 'delay event', (err) => {
      if (err) {
        console.log('添加延迟事件失败：', err);
      }
      console.log('添加延迟事件成功');
      this.jobs[jobKey] = body
    })
  }

  /**
   * @Author: 水痕
   * @Date: 2020-04-14 13:00:05
   * @LastEditors: 水痕
   * @Description: 订阅的方法
   * @param {type} 
   * @return: 
   */
  public subscription(): void {
    if (!this.sub) {
      this.getClient();
    }
    this.sub.on('pmessage', (pattern, channel, message) => {
      // match key  
      const keyMatcher = new RegExp(`^${this.eventKeyPrefix}(${_.keys(this.events).join('|')})_(\\S+)$`)
      const result = message.match(keyMatcher);
      console.log('result', result)
      if (result) {
        const type = result[1];
        const id = result[2];
        const handler = this.handlers[type]
        if (_.isFunction(handler)) {
          const jobKey = `${type}_${id}`
          if (this.jobs[jobKey]) {
            handler(id, this.jobs[jobKey])
          } else {
            console.log('未找到延迟事件，type=%s,id=%s', type, id);
          }
        } else {
          console.log('未找到事件处理器。type=%s', type)
        }
      }
    })
    // 订阅频道
    this.sub.psubscribe('__key*__:expired')
  }

  /**
   * 连接redis
   */
  private getClient(): void {
    this.client = this.redisService.getClient();
    this.sub = this.redisService.getClient();
  }
}
