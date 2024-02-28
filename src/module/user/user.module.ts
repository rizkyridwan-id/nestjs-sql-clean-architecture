import { Module } from '@nestjs/common';
import { UsersController } from './controller/user.controller';
import { UserRepositoryModule } from './repository/user.repository.module';
import { UserUseCaseModule } from './use-case/user.use-case.module';

@Module({
  imports: [UserUseCaseModule, UserRepositoryModule],
  controllers: [UsersController],
})
export class UserModule {}
