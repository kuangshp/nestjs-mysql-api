import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { RoleAccessEntity } from '@src/entities/model/system/role_access.entity';
import { AccessEntity } from '@src/entities/model/system/access.entity';

@Injectable()
export class RoleAccessService {

	/**
  * @Author: 水痕
  * @Date: 2020-05-19 08:29:21
  * @LastEditors: 水痕
  * @Description: 根据当前的角色获取已经授权的权限
  * @param {type} 
  * @return: 
  */
	async checkedAccessList(roleId: number): Promise<any> {
		return await getConnection().createQueryBuilder(RoleAccessEntity, 'rc')
			.select(['rc.id', 'rc.accessId'])
			.andWhere('rc.roleId =:roleId', { roleId })
			.getMany();
	}

	/**
  * @Author: 水痕
  * @Date: 2020-09-15 22:49:16
  * @LastEditors: 水痕
  * @Description: 查询出全部的资源(菜单)
  * @param {type} 
  * @return {type} 
  */
	async accessList(): Promise<AccessEntity[]> {
		// return await getConnection().createQueryBuilder(AccessEntity, 'ac1')
		// 	.andWhere('ac1.isDel=0 and ac1.moduleId = -1')
		// 	.select(['ac1.id', 'ac1.moduleName', 'ac1.actionName', 'ac1.moduleId'])
		// 	.leftJoinAndMapMany('ac1.children', AccessEntity, 'ac2', ' ac2.moduleId = ac1.id and ac2.isDel=0 and ac2.status=1')
		// 	.getMany();
		return await getConnection().createQueryBuilder(AccessEntity, 'ac')
			.andWhere('ac.isDel=0')
			.select(['ac.id', 'ac.moduleName', 'ac.actionName', 'ac.moduleId', 'ac.sort', 'ac.createdAt'])
			.orderBy({ 'ac.sort': 'ASC', 'ac.createdAt': 'ASC' })
			.getMany();
	}
}
