import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as qs from 'qs';
import { ZodSchema } from 'zod';

export const ZodQuery = (schema: ZodSchema) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.url.split('?')[1];
    const parsedQuery = qs.parse(query);

    return schema.parse(parsedQuery);
  })();
