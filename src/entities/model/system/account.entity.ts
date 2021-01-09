import { Column, Entity, BeforeInsert } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import SimpNodeAuth from 'simp-node-auth';
import { ObjectType } from '@src/types';
import { PublicEntity } from '../public.entity';

@Entity('account')
export class AccountEntity extends PublicEntity {
	@Exclude()
	private simpNodeAuth: SimpNodeAuth;
	constructor () {
		super()
		this.simpNodeAuth = new SimpNodeAuth();
	}

	@Column('varchar', {
		nullable: false,
		length: 50,
		name: 'username',
		comment: '用户名'
	})
	username: string;

	@Exclude() // 表示排除字段不返回给前端
	@Column('varchar', {
		nullable: false,
		length: 100,
		name: 'password',
		comment: '密码'
	})
	password: string;

	@Column('int', {
		nullable: true,
		name: 'platform',
		comment: '平台'
	})
	platform: number;

	@Column('tinyint', {
		nullable: false,
		default: () => 0,
		name: 'is_super',
		comment: '是否为超级管理员1表示是,0表示不是'
	})
	isSuper: number;

	/**
   * @Author: 水痕
   * @Date: 2020-01-23 09:02:59
   * @LastEditors: 水痕
   * @Description: 插件数据库前先给密码加密
   * @param {type} 
   * @return: 
   */
	@BeforeInsert()
	makePassword() {
		this.password = this.simpNodeAuth.makePassword(this.password);
	}

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:03:45
   * @LastEditors: 水痕
   * @Description: 检查密码是否正确
   * @param {type} 
   * @return: 
   */
	checkPassword(password: string, sqlPassword: string) {
		return this.simpNodeAuth.checkPassword(password, sqlPassword);
	}
	/**
		 * @Author: 水痕
		 * @Date: 2020-01-23 09:04:38
		 * @LastEditors: 水痕
		 * @Description: 生产token签名
		 * @param {type} 
		 * @return: 
		 */
	@Expose()
	private get token() {
		const { id, username, isSuper } = this;
		// 生成签名
		return jwt.sign(
			{
				id,
				username,
				isSuper,
			},
			process.env.SECRET, // 加盐
			{
				expiresIn: '7d', // 过期时间
			},
		);
	}

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:19:49
   * @LastEditors: 水痕
   * @Description: 定义返回数据,用了这个函数后上面的Exclude和Expose就失效了
   * @param {type} 
   * @return: 
   */
	public toResponseObject(isShowToken = true): object {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { simpNodeAuth, password, token, ...params } = this;
		const responseData: ObjectType = {
			...params,
		}
		if (isShowToken) {
			return Object.assign(responseData, { token });
		} else {
			return responseData;
		}
	}
}
