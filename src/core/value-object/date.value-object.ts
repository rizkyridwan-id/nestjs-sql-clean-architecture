import { DomainPrimitive } from '../base/types/domain-primitive.type';
import { ValueObject } from '../base/domain/value-object';

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  protected validate({ value }: DomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error('Invalid Date');
    }
  }
}
