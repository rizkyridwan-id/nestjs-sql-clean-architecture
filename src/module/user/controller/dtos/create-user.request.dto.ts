import { RegisterUserRequestDto } from 'src/module/auth/controller/dto/register-user-request.dto';
import * as z from 'zod';

export type CraeteUserRequestDto = z.infer<typeof CraeteUserRequestDto>;
export const CraeteUserRequestDto = RegisterUserRequestDto.extend({
  level: z.string().optional(),
});
