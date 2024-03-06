import { UserEntity } from './user.entity';
import { UserModel } from '../repository/user.model';
import { IDbMapper } from 'src/port/interface/db-mapper.interface';

export class UserMapper implements IDbMapper<UserEntity, UserModel> {
  toSqlProps(entity: UserEntity): UserModel {
    const entityProps = entity.getPropsCopy();

    const sqlModel: UserModel = new UserModel({
      password: entityProps.password,
      user_id: entityProps.user_id,
      user_name: entityProps.user_name,
      level: entityProps.level.value,
    });
    return sqlModel;
  }
}
