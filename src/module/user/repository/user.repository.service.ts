import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryPort } from '../../../port/repository/user.repository.port';

import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../domain/user.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';
import { UserModel } from './user.model';
import { USER_MODEL } from './user.model';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, UserModel>
  implements UserRepositoryPort
{
  constructor(
    @Inject(USER_MODEL)
    private userModel: typeof UserModel,
  ) {
    super(userModel, new UserMapper());
  }
}
