import { Module } from '@nestjs/common';
import { userModelProvider } from './user.model';
import { userRepositoryProvider } from './user.repository.provider';

@Module({
  providers: [userRepositoryProvider, userModelProvider],
  exports: [userRepositoryProvider, userModelProvider],
})
export class UserRepositoryModule {}
