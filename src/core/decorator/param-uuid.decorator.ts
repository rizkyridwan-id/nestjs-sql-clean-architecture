import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export const ParamUuid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { id } = request.params;
    if (!isValidObjectId(id)) {
      throw new BadRequestException('The Param Id is not valid.');
    }

    return id;
  },
);
