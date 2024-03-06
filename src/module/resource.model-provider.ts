import { ModelCtor } from 'sequelize-typescript';
import { UserModel } from './user/repository/user.model';

// Add new model here.
export const ResourceModelProviders: ModelCtor[] = [UserModel];
