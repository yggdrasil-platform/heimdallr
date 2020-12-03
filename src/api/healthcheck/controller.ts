import { Request, Response } from 'express';

// Controllers.
import BaseController from '../base/controller';

export default class Controller extends BaseController {
  public get(req: Request, res: Response): void {
    res.status(200).send('OK').end();
  }
}
