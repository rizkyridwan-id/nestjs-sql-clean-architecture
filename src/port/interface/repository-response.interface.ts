import { Types } from 'mongoose';

export interface IRepositoryResponse {
  message?: string;
  _id?: Types.ObjectId;
  n?: number;
  nModified?: number;
}
