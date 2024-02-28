import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';
import { EnvService } from '../../../infra/config/env.service';

@Injectable()
export class SignatureService {
  constructor(readonly envService: EnvService) {}
  computeSignature(
    apiKey: string,
    secretKey: string,
    accessToken: string,
    timestamp: string,
  ) {
    const payload = apiKey + secretKey + accessToken + timestamp;
    return SHA256(payload).toString();
  }

  validateSignature(
    signature: string,
    timestamp: string,
    accessToken: string,
    tolerance: number,
  ): boolean {
    const headerDate = new Date(timestamp);
    const currentDate = new Date();
    const diffDateSecond =
      (currentDate.getTime() - headerDate.getTime()) / 1000;

    if (diffDateSecond < -tolerance || diffDateSecond > tolerance) {
      return false;
    }

    const envVariables = this.envService.variables;
    const expectedSignature = this.computeSignature(
      envVariables.apiKey,
      envVariables.secretKey,
      accessToken,
      timestamp,
    );
    return signature === expectedSignature;
  }
}
