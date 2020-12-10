import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

// Controllers.
import BaseController from '../base/controller';

// Models.
import { Service } from '../../models';

// Types.
import { HealthcheckResponse } from './types';

export default class Controller extends BaseController {
  public async get(req: Request, res: Response): Promise<void> {
    const services: Service[] = await this.connection
      .getRepository(Service)
      .createQueryBuilder('service')
      .getMany();
    const healthcheckResponses: HealthcheckResponse[] = [
      {
        environment: process.env.NODE_ENV,
        isDatabaseConnected: this.connection.isConnected,
        name: process.env.SERVICE_NAME,
        version: process.env.VERSION,
      },
    ];
    let response: AxiosResponse<HealthcheckResponse>;

    for (const service of services) {
      try {
        response = await axios.get(`${service.url}/healthcheck`);

        healthcheckResponses.push(response.data);
      } catch (error) {
        this.logger.error(error);
      }
    }

    res.status(200).json(healthcheckResponses);
  }
}
