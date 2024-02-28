import { Inject, Provider } from '@nestjs/common';
import { UserRepository } from './user.repository.service';

export const InjectUserRepository = Inject(UserRepository.name);
export const userRepositoryProvider: Provider = {
  provide: UserRepository.name,
  useClass: UserRepository,
};
