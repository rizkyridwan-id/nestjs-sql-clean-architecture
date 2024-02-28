import { ColorLevel } from '../../core/constant/logger/color.const';
import chalk from 'chalk';

export function generateColor(level: string) {
  switch (level) {
    case 'info':
      return ColorLevel['info'];
    case 'warn':
      return ColorLevel['warn'];
    case 'error':
      return ColorLevel['error'];
    case 'debug':
      return ColorLevel['debug'];
    case 'verbose':
      return ColorLevel['verbose'];
    default:
      return '#000000';
  }
}

export function generateTagLevel(level: string, color: string) {
  return chalk.bgHex(color).white.bold(` ${level.toUpperCase()} `);
}
