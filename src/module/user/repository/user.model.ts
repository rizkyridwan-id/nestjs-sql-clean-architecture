import { Provider } from '@nestjs/common';
import { Optional } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  user_id: string;
  user_name: string;
  password: string;
  level: string;
  input_by?: string;
  input_date?: Date;
  edit_by?: string;
  edit_date?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({ tableName: 'tm_user' })
export class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  @Column({ allowNull: false, unique: true })
  user_id: string;

  @Column({ allowNull: false })
  user_name: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  level: string;

  @Column
  input_by?: string;

  @Column
  input_date?: Date;

  @Column
  edit_by?: string;

  @Column
  edit_date?: Date;
}

export const USER_MODEL = 'USER_MODEL';
export const userModelProvider: Provider = {
  provide: USER_MODEL,
  useValue: UserModel,
};
