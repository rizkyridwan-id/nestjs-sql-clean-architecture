import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard';

export function SecureGet(path = '') {
  return applyDecorators(UseGuards(JwtAuthGuard), Get(path));
}
