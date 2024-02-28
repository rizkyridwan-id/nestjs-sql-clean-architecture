import { Module } from '@nestjs/common';
import { resourceProviders } from './resource.provider';
import { APP_GUARD } from '@nestjs/core';
import { SignatureGuard } from 'src/core/guard/signature.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: SignatureGuard,
    },
  ],
  imports: resourceProviders,
  exports: resourceProviders,
})
export class ResourceModule {}
