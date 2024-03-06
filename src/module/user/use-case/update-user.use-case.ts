import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdateUserRequestDto } from '../controller/dtos/update-user.request.dto';
import { UserModel } from '../repository/user.model';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';

import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

type TUpdateUserPayload = PickUseCasePayload<
  UpdateUserRequestDto,
  'data' | 'id'
>;
@Injectable()
export class UpdateUser
  extends BaseUseCase
  implements IUseCase<TUpdateUserPayload>
{
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute({ data, id }: TUpdateUserPayload): Promise<ResponseDto> {
    try {
      const payload: Partial<UserModel> = data;

      await this.userRepository.update(payload, { where: { id } });
    } catch (err) {
      this.logger.error(err.message);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
    return new ResponseDto({
      status: HttpStatus.OK,
      message: `User ${id} documents updated`,
    });
  }
}
