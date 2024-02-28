import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/core/constant/config/env-key.const';

export interface IEnv {
  mode: string;
  port: string;
  httpsMode: boolean;
  dbConnectionUri: string;
  jwtSecretKey: string;
  jwtRefreshKey: string;
  apiKey: string;
  secretKey: string;
}
@Injectable()
export class EnvService {
  private readonly _mode: string;
  private readonly _port: string;
  private readonly _httpsMode: boolean;

  private readonly _dbConnectionUri: string;
  private readonly _jwtSecretKey: string;
  private readonly _jwtRefreshKey: string;

  private readonly _apiKey: string;
  private readonly _secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this._mode = this.configService.get<string>(EnvKey.MODE)!;
    this._port = this.configService.get<string>(EnvKey.PORT)!;
    this._httpsMode = Boolean(
      +this.configService.get<number>(EnvKey.HTTPS_MODE)!,
    );
    this._dbConnectionUri = this.configService.get<string>(
      EnvKey.DB_CONNECTION_URI,
    )!;
    this._jwtSecretKey = this.configService.get<string>(EnvKey.JWT_SECRET_KEY)!;
    this._jwtRefreshKey = this.configService.get<string>(
      EnvKey.JWT_REFRESH_KEY,
    )!;
    this._apiKey = this.configService.get<string>(EnvKey.API_KEY)!;
    this._secretKey = this.configService.get<string>(EnvKey.SECRET_KEY)!;
  }

  get variables(): IEnv {
    return {
      mode: this._mode,
      port: this._port,
      httpsMode: this._httpsMode,
      dbConnectionUri: this._dbConnectionUri,
      jwtSecretKey: this._jwtSecretKey,
      jwtRefreshKey: this._jwtRefreshKey,
      apiKey: this._apiKey,
      secretKey: this._secretKey,
    };
  }
}
