import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { OptionalSecretKey } from 'src/port/interface/optional-secret-key.interface';
import { EnvService } from 'src/infra/config/env.service';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { CraeteUserRequestDto } from '../controller/dtos/create-user.request.dto';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserEntity } from '../domain/user.entity';
import { UserLevel } from '../domain/value-objects/user-level.value-object';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { SHA256 } from 'crypto-js';
type TCreateUserPayload = PickUseCasePayload<
  CraeteUserRequestDto & OptionalSecretKey,
  'data' | 'user'
>;

@Injectable()
export class CreateUser
  extends BaseUseCase
  implements IUseCase<TCreateUserPayload>
{
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private envService: EnvService,
  ) {
    super();
  }

  public async execute({
    data,
    user,
  }: TCreateUserPayload): Promise<ResponseDto> {
    await this.userRepository.findOneAndThrow({ user_id: data.user_id });

    const isSecretKeyValid = await this._validateSecretKey(data.secretKey);
    const level = await this._generateUserLevel(isSecretKeyValid, data?.level);

    try {
      const userEntity = await UserEntity.create({
        user_name: data.user_name,
        user_id: data.user_id,
        password: data.password,
        level: level,
        input_by: user?.user_id,
      });

      const result = await this.userRepository.save(userEntity);

      return new ResponseDto({ status: HttpStatus.CREATED, data: result });
    } catch (err) {
      this.logger.error(err.message);

      throw new HttpException(
        { message: err.message || err },
        err.message.includes('exists')
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _validateSecretKey(secretKey?: string): Promise<boolean> {
    const systemSecretKey = SHA256(
      this.envService.variables.secretKey,
    ).toString();
    const isSecretKeyValid = secretKey && secretKey === systemSecretKey;

    if (secretKey && !isSecretKeyValid)
      throw new BadRequestException('Wrong Key Input. Transaction aborted.');

    return isSecretKeyValid || false;
  }
  private async _generateUserLevel(isSecretKeyValid: boolean, level?: string) {
    if (isSecretKeyValid)
      await this.userRepository.findOneAndThrow(
        { level: 'SU' },
        'Level System Sudah Terdaftar.',
      );
    return isSecretKeyValid
      ? new UserLevel('SU')
      : level
        ? new UserLevel(level)
        : new UserLevel('ADMIN');
  }
}
