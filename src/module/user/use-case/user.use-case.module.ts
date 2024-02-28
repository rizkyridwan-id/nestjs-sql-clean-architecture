import { Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { UserRepositoryModule } from '../repository/user.repository.module';
import { userUseCaseProvider } from './user.use-case.provider';

@Module({
  imports: [UserRepositoryModule, EnvModule],
  exports: userUseCaseProvider,
  providers: userUseCaseProvider,
})
export class UserUseCaseModule {}
