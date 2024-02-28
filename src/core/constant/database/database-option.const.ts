import { ConnectOptions } from 'mongoose';

export const DATABASE_OPTION: ConnectOptions = Object.freeze({
  w: 'majority',
});
