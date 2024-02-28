import { Provider } from '@nestjs/common';
import { CreateUser } from './create-user.use-case';
import { DeleteUser } from './delete-user.use-case';
import { GetUser } from './get-user.use-case';

import { UpdateUser } from './update-user.use-case';

export const userUseCaseProvider: Provider[] = [
  CreateUser,
  DeleteUser,
  GetUser,
  UpdateUser,
];
