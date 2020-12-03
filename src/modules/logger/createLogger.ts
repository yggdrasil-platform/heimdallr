import {
  createLogger as createWinstonLogger,
  Logger,
  transports,
} from 'winston';

export default function createLogger(name?: string): Logger {
  return createWinstonLogger({
    exitOnError: false,
    transports: [
      new transports.Console({
        level: 'debug',
        handleExceptions: true,
      }),
    ],
    ...(name && {
      defaultMeta: {
        service: name,
      },
    }),
  });
}
