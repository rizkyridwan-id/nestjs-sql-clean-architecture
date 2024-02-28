import { Type } from '@nestjs/common';

export type TMixedInput<T> = {
  type: Type<T>;
  example?: Array<T> | T;
  isArray?: boolean;
};
