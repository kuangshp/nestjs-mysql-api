import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './model/system/role.entity';
import { AccessEntity } from './model/system/access.entity';
import { RoleAccessEntity } from './model/system/role_access.entity';
import { DictConfigEntry } from './model/system/dict.config.entity';
import { AccountEntity } from './model/system/account.entity';
import { AccountRoleEntity } from './model/system/account_role.entity';

const entityList = [
  AccountEntity,
  AccountRoleEntity,
  RoleEntity,
  AccessEntity,
  RoleAccessEntity,
  DictConfigEntry,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(entityList),
  ],
  exports: [
    TypeOrmModule.forFeature(entityList),
  ],
})
export class EntityModule { }
