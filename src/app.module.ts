import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from './core/helper/helper.module';
import { databaseProviders } from './infra/database/database.provider';
import { ResourceModule } from './module/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelperModule,
    ResourceModule,
    ...databaseProviders,
  ],
})
export class AppModule {}
