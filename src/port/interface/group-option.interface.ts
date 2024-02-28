import { IGroupId } from './group-id.interface';

export interface IGroupOption {
  _id: string | IGroupId;
  [key: string]: string | any;
}
