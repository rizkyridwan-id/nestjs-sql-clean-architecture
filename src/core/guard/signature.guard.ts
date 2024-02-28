import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignatureService } from '../helper/module/signature.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(
    private signatureService: SignatureService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const signature =
      (req.headers.signature as string) || (req.query['signature'] as string);
    const timestamp =
      (req.headers.timestamp as string) || (req.query['timestamp'] as string);
    const accessToken =
      (req.headers.authorization as string) ||
      (req.query['authorization'] as string) ||
      '';

    const isValidSignature = this.signatureService.validateSignature(
      signature,
      timestamp,
      accessToken.slice('bearer '.length),
      60,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid Signature.');
    }

    return true;
  }
}
