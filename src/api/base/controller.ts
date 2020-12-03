import { NextFunction } from 'express';
import { Logger } from 'winston';

// Errors.
import { RequestError } from '../../errors';

// Types.
import { RouterOptions } from '../../types';

export default class Controller {
  protected readonly logger: Logger;

  constructor(options: RouterOptions) {
    this.logger = options.logger;
  }

  protected handleError(error: Error | RequestError, next: NextFunction): void {
    if (error instanceof RequestError) {
      return next(error);
    }

    // Wrap all other errors as a 500 RequestError.
    return next(new RequestError(500, error.message));
  }
}
