import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { resolve } from 'path';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as ip from 'ip';
import { CustomLogger } from './infra/logger/logger';
import { AllExceptionFilter } from './core/base/http/base-http-exception.filter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { DebugLoggerInterceptor } from './core/interceptor/debug-logger.interceptor';

async function bootstrap() {
  const httpsMode = !!Number(process.env.HTTPS_MODE);
  const secureOptions: NestApplicationOptions =
    generateHttpsModeOption(httpsMode);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      ...secureOptions,
      logger: new CustomLogger(),
      cors: true, // change this to Client IP when Production
    },
  );

  await app.register(fastifyCsrf);
  await app.register(fastifyHelmet);

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new DebugLoggerInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';
  const logger = new Logger('NestBoilerplate');

  await app.listen(port, host, () => {
    logger.log(`Application Started at port: ${port}, httpsMode: ${httpsMode}`);
    if (process.env.MODE == 'DEVELOPMENT')
      logger.log(`Current Local IP: ${ip.address()}`);
  });
}

function generateHttpsModeOption(httpsMode: boolean): NestApplicationOptions {
  if (httpsMode) {
    /**
     * Enter Your Https Certificate using below code
     *
     * @hint make sure you set 'HTTPS_MODE' field in env file to 1
     * @tips recommended for using absolute root path (/)
     * @optional __dirname + path/to/file
     */

    const privateKey = fs.readFileSync(
      resolve('/home/cert/private.key'),
      'utf-8',
    );
    const certificate = fs.readFileSync(
      resolve('/home/cert/certificate.crt'),
      'utf-8',
    );

    const credentials: HttpsOptions = {
      key: privateKey,
      cert: certificate,
      passphrase: '??',
    };
    return { httpsOptions: credentials };
  }
  return {};
}
bootstrap();
