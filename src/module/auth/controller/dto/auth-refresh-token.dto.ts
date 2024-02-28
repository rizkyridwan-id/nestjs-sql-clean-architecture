import * as z from 'zod';

export type AuthRefreshTokenRequestDto = z.infer<
  typeof AuthRefreshTokenRequestDto
>;
export const AuthRefreshTokenRequestDto = z.object({
  user_id: z.string(),
  refresh_token: z.string(),
});
