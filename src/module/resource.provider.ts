import { AuthModule } from './auth/auth.module';
import { StatusModule } from './status/status.module';
import { UserModule } from './user/user.module';

export const resourceProviders = [StatusModule, AuthModule, UserModule];
