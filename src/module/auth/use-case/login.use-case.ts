import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

import { EnvService } from 'src/infra/config/env.service';
import { InjectUserRepository } from 'src/module/user/repository/user.repository.provider';
import { UserEntity } from 'src/module/user/domain/user.entity';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { LoginRequestDto } from '../controller/dto/login-user-request.dto';

type TLoginPayload = PickUseCasePayload<LoginRequestDto, 'data'>;
@Injectable()
export class LoginUser extends BaseUseCase implements IUseCase<TLoginPayload> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private jwtService: JwtService,
    private envService: EnvService,
  ) {
    super();
  }

  public async execute({ data }: TLoginPayload): Promise<ResponseDto> {
    const userData = await this.userRepository.findOneOrThrow(
      {
        user_id: data.user_id,
      },
      'Username atau password salah.',
    );

    const passwordMatch = await UserEntity.comparePassword(
      data.password,
      userData.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username or Password is Incorrect.');
    }

    const jwtPayload = {
      sub: userData.user_id,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: 86400,
      secret: this.envService.variables.jwtRefreshKey,
    });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: {
        user_id: userData.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
        level: userData.level,
        user_name: userData.user_name,
      },
    });
  }
}
