import { IId } from '../interface/id.interface';

export interface UserResponseDtoProps extends IId {
  user_id: string;
  user_name: string;
  level: string;
}
