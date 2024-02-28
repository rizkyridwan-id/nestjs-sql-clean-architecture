import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';

export class UserLevel extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate({ value }: DomainPrimitive<string>) {
    const isLevelValid = this._getValidLevel().find(
      (level: string) => level === value,
    );
    if (!isLevelValid)
      throw new BadRequestException('The User Level is not valid');
  }

  private _getValidLevel() {
    return ['ADMIN', 'OWNER', 'SUPERVISOR', 'SU']; // LEVEL SU WILL BE USED ONE TIME ONLY (POST APP DEPLOY), ALWAYS DELETE USER WITH THIS LEVEL AFTER USE IT.
  }
}
