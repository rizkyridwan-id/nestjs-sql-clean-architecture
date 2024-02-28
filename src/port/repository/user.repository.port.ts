import { BaseRepositoryPort } from './repository.base.port';
import { UserEntity } from '../../module/user/domain/user.entity';
import { UserMongoEntity } from '../../module/user/repository/user.mongo-entity';

export interface UserRepositoryPort
  extends BaseRepositoryPort<UserEntity, UserMongoEntity> {
  findActiveUser(): Promise<Array<UserMongoEntity>>;
}
