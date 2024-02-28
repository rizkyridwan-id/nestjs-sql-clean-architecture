import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamIdNumber = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { id } = request.params;
    return +id || 0;
  },
);
