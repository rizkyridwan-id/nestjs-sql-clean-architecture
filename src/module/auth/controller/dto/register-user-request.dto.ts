import * as z from 'zod';

export type RegisterUserRequestDto = z.infer<typeof RegisterUserRequestDto>;
export const RegisterUserRequestDto = z.object({
  user_id: z.string(),
  user_name: z.string(),
  password: z.string(),
});
