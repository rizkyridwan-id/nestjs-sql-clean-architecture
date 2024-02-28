import * as z from 'zod';

export type LoginRequestDto = z.infer<typeof LoginRequestDto>;
export const LoginRequestDto = z.object({
  user_id: z.string(),
  password: z.string(),
});
