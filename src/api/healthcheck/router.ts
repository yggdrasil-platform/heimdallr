import { Router } from 'express';

// Controllers.
import Controller from './controller';

// Types.
import { RouterOptions } from '../../types';

export default function router(route: string, options: RouterOptions): Router {
  const controller: Controller = new Controller(options);

  return Router().get('/', controller.get.bind(controller));
}
