import { TPrimitive } from './primitive.type';

export interface DomainPrimitive<T extends TPrimitive | Date> {
  value: T;
}
