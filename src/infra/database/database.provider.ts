import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '../config/env.module';
import { EnvService } from '../config/env.service';
import { DATABASE_OPTION } from '../../core/constant/database/database-option.const';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [EnvModule],
    inject: [EnvService],
    useFactory: ({ variables }: EnvService) => {
      return {
        uri: variables.dbConnectionUri,
        ...DATABASE_OPTION,
      };
    },
  }),
];
