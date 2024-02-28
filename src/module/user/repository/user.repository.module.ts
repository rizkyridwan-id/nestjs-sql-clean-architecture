import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './user.mongo-entity';
import { userRepositoryProvider } from './user.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(UserModel)],
  providers: [userRepositoryProvider],
  exports: [userRepositoryProvider],
})
export class UserRepositoryModule {}
