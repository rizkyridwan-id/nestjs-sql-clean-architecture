import { BaseRepositoryPort } from './repository.base.port';
import { UserEntity } from '../../module/user/domain/user.entity';
import { UserModel } from '../../module/user/repository/user.model';

export interface UserRepositoryPort
  extends BaseRepositoryPort<UserEntity, UserModel> {}
