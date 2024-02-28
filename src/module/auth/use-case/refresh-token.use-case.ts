import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { EnvService } from 'src/infra/config/env.service';
import { AuthRefreshTokenRequestDto } from 'src/module/auth/controller/dto/auth-refresh-token.dto';

interface IHistoryRefreshToken {
  refresh_token: string;
  expired_at: Date;
}

type TRefreshTokenPayload = PickUseCasePayload<
  AuthRefreshTokenRequestDto,
  'data'
>;
@Injectable()
export class RefreshToken
  extends BaseUseCase
  implements IUseCase<TRefreshTokenPayload>
{
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {
    super();
  }

  static historyRefreshTokenList: IHistoryRefreshToken[] = [];

  async execute({ data }: TRefreshTokenPayload) {
    this._validateRefreshToken(data.refresh_token, data.user_id);

    const payload = { sub: data.user_id };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 86400,
      secret: this.envService.variables.jwtRefreshKey,
    });
    this._registerUsedRefreshToken(data.refresh_token);

    return { access_token: token, refresh_token: refreshToken };
  }

  private _validateRefreshToken(refreshToken: string, user_id: string) {
    const tokenVerified = this._verifyJwt(refreshToken);

    if (tokenVerified?.sub != user_id) {
      throw new BadRequestException('Refresh token is not matched.');
    }

    const tokenUsed = RefreshToken.historyRefreshTokenList.find(
      (it) => it.refresh_token === refreshToken,
    );

    const isTokenUsedExpired =
      tokenUsed && tokenUsed.expired_at.getTime() < new Date().getTime();
    if (isTokenUsedExpired)
      throw new BadRequestException('Refresh Token is Expired');
  }

  private _verifyJwt(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.envService.variables.jwtRefreshKey,
      });
    } catch {
      throw new BadRequestException('Token is Not Valid');
    }
  }

  private _registerUsedRefreshToken(refreshToken: string) {
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 3);

    const isTokenExist = RefreshToken.historyRefreshTokenList.find(
      (it) => it.refresh_token === refreshToken,
    );
    if (isTokenExist) return;

    RefreshToken.historyRefreshTokenList.push({
      refresh_token: refreshToken,
      expired_at: expiredAt,
    });
  }
}
