import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/core/constant/database/database-option.const';
import { EnvService } from '../config/env.service';
import { ResourceModelProviders } from 'src/module/resource.model-provider';

export const databaseProviders: Provider[] = [
  {
    provide: SEQUELIZE,
    useFactory: async (envService: EnvService) => {
      const sequelize = new Sequelize(envService.variables.dbConnectionUri, {
        logging: false,
      });
      sequelize.addModels(ResourceModelProviders);
      await sequelize.sync();
      return sequelize;
    },
    inject: [EnvService],
  },
];
