import { BadRequestException } from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { ValueObject } from '../base/domain/value-object';
import { DomainPrimitive } from '../base/types/domain-primitive.type';

export class ObjectIdVO extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  get valueConverted() {
    return Types.ObjectId.createFromHexString(this.props.value);
  }

  protected validate({ value }: DomainPrimitive<string>) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Value ObjectID tidak valid.');
    }
  }
}
