import { Types } from 'mongoose';

export class TypeValidator {
  static isObject(value: any) {
    return typeof value === 'object';
  }
  static isDate(value: any) {
    return value instanceof Date;
  }
  static isArray(value: any) {
    return Array.isArray(value);
  }

  static extractMongoId(id: string | Types.ObjectId): string {
    return id instanceof Types.ObjectId ? id.toString() : id;
  }
}
