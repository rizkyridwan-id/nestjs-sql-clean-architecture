import * as z from 'zod';

export type UpdateUserRequestDto = z.infer<typeof UpdateUserRequestDto>;
export const UpdateUserRequestDto = z.object({
  user_name: z.string(),
  level: z.string(),
});
