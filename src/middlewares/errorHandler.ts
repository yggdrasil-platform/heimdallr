import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

// Errors.
import { RequestError } from '../errors';

/**
 * Simple error handling middleware.
 */
const errorHandler = (logger: Logger) => (
  error: RequestError | undefined,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  let status: number;

  if (error) {
    logger.error(error.message);

    status = (error as RequestError).status || 500;

    return res.status(status).json({
      status,
      message: error.message,
    });
  }

  return next(error);
};

export default errorHandler;
