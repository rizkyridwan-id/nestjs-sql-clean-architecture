import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdateUserRequestDto } from '../controller/dtos/update-user.request.dto';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';

import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';

type TUpdateUserPayload = PickUseCasePayload<
  UpdateUserRequestDto,
  'data' | '_id'
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

  async execute({ data, _id }: TUpdateUserPayload): Promise<ResponseDto> {
    try {
      const payload: Partial<UserMongoEntity> = data;

      await this.userRepository.update(
        { _id: new ObjectIdVO(_id).valueConverted },
        payload,
      );
    } catch (err) {
      this.logger.error(err.message);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
    return new ResponseDto({
      status: HttpStatus.OK,
      message: `User ${_id} documents updated`,
    });
  }
}
