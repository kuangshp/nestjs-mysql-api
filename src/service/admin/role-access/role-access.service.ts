import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAccessEntity } from '@src/entities/role_access.entity';

@Injectable()
export class RoleAccessService extends BaseService {
  constructor (
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
  ) {
    super(roleAccessRepository);
  }
}
