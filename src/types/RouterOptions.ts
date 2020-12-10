import { Connection } from 'typeorm';
import { Logger } from 'winston';

interface RouterOptions {
  connection: Connection;
  logger: Logger;
}

export default RouterOptions;
