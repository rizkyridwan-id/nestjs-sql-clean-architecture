import { Global, Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { HashService } from './module/hash.service';
import { SignatureService } from './module/signature.service';

@Global()
@Module({
  imports: [EnvModule],
  providers: [SignatureService, HashService],
  exports: [SignatureService, HashService, EnvModule],
})
export class HelperModule {}
