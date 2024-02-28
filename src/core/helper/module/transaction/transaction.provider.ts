import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TransactionService } from './transaction.service';

export const transactionProvider = [
  {
    provide: TransactionService,
    useFactory: (primaryConnection: Connection) =>
      new TransactionService(primaryConnection),
    inject: [getConnectionToken()],
  },
];
