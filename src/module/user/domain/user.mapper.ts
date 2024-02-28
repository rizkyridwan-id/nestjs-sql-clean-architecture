import { UserEntity } from './user.entity';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';

export class UserMapper extends DbMapper<UserEntity, UserMongoEntity> {
  protected toMongoProps(
    entity: UserEntity,
  ): MongoEntityProps<UserMongoEntity> {
    const entityProps = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<UserMongoEntity> = {
      ...entityProps,
      level: entityProps.level.value,
    };
    return mongoProps;
  }
}
