import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { UserMongoEntity } from './user.mongo-entity';

import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../domain/user.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, UserMongoEntity>
  implements UserRepositoryPort
{
  constructor(
    @InjectModel(UserMongoEntity.name)
    private userModel: Model<UserMongoEntity>,
  ) {
    super(userModel, new UserMapper(UserMongoEntity));
  }

  async findActiveUser(): Promise<Array<UserMongoEntity>> {
    return await this.userModel.find({ status: true });
  }
}
