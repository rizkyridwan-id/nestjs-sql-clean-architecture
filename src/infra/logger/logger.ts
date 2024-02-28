import { LoggerService } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { generateColor, generateTagLevel } from './generator.function';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import chalk from 'chalk';

export class CustomLogger implements LoggerService {
  private logger: Logger;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    this.initLogger();
  }

  public log(message: any, ...meta: Array<any>) {
    this.logger.info(message, meta);
  }

  public error(message: any, ...meta: Array<any>) {
    this.logger.error(message, meta);
  }

  public warn(message: any, ...meta: Array<any>) {
    this.logger.warn(message, meta);
  }

  public debug(message: any, ...meta: Array<any>) {
    this.logger.log('debug', this.stringifyMessage(message), meta);
  }

  public verbose(message: any, ...meta: Array<any>) {
    this.logger.log('verbose', this.stringifyMessage(message, 4), meta);
  }

  private stringifyMessage(message: any, space = 2) {
    return typeof message !== 'string'
      ? JSON.stringify(message, null, space)
      : message;
  }

  private initLogger() {
    const timeformat = 'YYMMDD, HH:mm:ss';

    this.logger = createLogger({
      level: this.getLoggerLevel(),
      format: format.combine(
        format.timestamp({ format: timeformat }),
        format.json(),
      ),
      transports: [
        this.createConsoleTransport(),
        ...this.createFileTransports(timeformat),
      ],
    });
  }

  private isProduction() {
    return process.env.MODE === 'PRODUCTION';
  }

  private createConsoleTransport(): ConsoleTransportInstance {
    return new transports.Console({
      format: format.combine(
        format.printf((info: any) => this.logFormatHandler(info)),
      ),
    });
  }

  private createFileTransports(timeformat: string): Array<any> {
    if (this.isProduction()) {
      const fileOptions = [
        new transports.DailyRotateFile({
          filename: 'logs/server-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          format: format.combine(
            format.timestamp({ format: timeformat }),
            format.align(),
            format.printf(
              (info: any) =>
                `${[info.timestamp]} ${info.level}: ${
                  info.message
                }\n::[${this.getContext(info)}]${this.generateMetaTrace(info)}`,
            ),
          ),
        }),
      ];

      return fileOptions;
    }
    return [];
  }

  private logFormatHandler(info: any) {
    const timestamp: string = chalk.green(info.timestamp);
    const levelTag: string = generateTagLevel(
      info.level,
      generateColor(info.level),
    );
    const contextTag: string = chalk.hex(generateColor(info.level))(
      `[${this.getContext(info)}]`,
    );
    const metaTrace: string = this.generateMetaTrace(info);
    return `${timestamp}   ${levelTag} ${contextTag}${chalk.hex(
      generateColor(info.level),
    )(metaTrace)} ${info.message}`;
  }

  private getContext(info: any) {
    return this.context || info['0'];
  }

  private generateMetaTrace(info: any) {
    const keys = Object.keys(info).filter((k) => /^\d+$/.test(k));
    let additionalTrace = '';
    for (let i = 0; i < keys.length; i++) {
      if (info[keys[i]] && info[keys[i]] !== this.getContext(info))
        additionalTrace += `[${info[keys[i]]}]`;
    }
    return additionalTrace;
  }

  private getLoggerLevel() {
    return this.isProduction() ? 'info' : 'debug';
  }
}
