import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async startTransaction(): Promise<ClientSession> {
    const session: ClientSession = await this.connection.startSession();
    return session;
  }

  async commitTransaction(session: ClientSession): Promise<void> {
    await session.commitTransaction();
    await session.endSession();
  }

  async rollbackTransaction(session: ClientSession): Promise<void> {
    await session.abortTransaction();
    await session.endSession();
  }
}
