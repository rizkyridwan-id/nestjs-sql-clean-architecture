import { Provider } from '@nestjs/common';
import { LoginUser } from './login.use-case';
import { RefreshToken } from './refresh-token.use-case';

export const authUseCaseProvider: Provider[] = [LoginUser, RefreshToken];
