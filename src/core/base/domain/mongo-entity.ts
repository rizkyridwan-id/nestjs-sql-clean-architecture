import { Types } from 'mongoose';

export abstract class BaseMongoEntity<MongoModel> {
  _id: Types.ObjectId;

  constructor(props?: MongoModel) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
