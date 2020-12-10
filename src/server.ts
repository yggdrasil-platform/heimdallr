import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { json, urlencoded } from 'body-parser';
import Express, { Application } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { hostname } from 'os';
import { Connection, createConnection } from 'typeorm';
import { Logger } from 'winston';

// Configs.
import { databaseConfig } from './config';

// Constants.
import { Endpoints } from './constants';

// Middlewares.
import { errorHandler } from './middlewares';

// Models.
import { Service } from './models';

// Modules.
import { createLogger } from './modules/logger';

// Routers.
import healthcheckRouter from './api/healthcheck/router';

// Seeds.
import seeds from './seeds';

// Types.
import { RouterOptions } from './types';

export class ExpressServer {
  public readonly app: Application;
  public connection: Connection;
  public graphqlServer: ApolloServer;
  public readonly logger: Logger;

  constructor() {
    this.app = Express();
    this.logger = createLogger(process.env.SERVICE_NAME, process.env.LOG_LEVEL);
  }

  /**
   * Sets up all the API routes.
   */
  public api(): void {
    let error: Error;
    let options: RouterOptions;

    if (!this.connection || !this.connection.isConnected) {
      error = new Error('database not connected');

      this.logger.error(error.message);

      throw error;
    }

    options = {
      connection: this.connection,
      logger: this.logger,
    };

    // Add routes.
    this.app.use(
      Endpoints.HEALTHCHECK,
      healthcheckRouter(Endpoints.HEALTHCHECK, options)
    );

    // Error handling.
    this.app.use(errorHandler(this.logger));
  }

  /**
   * Configures the application.
   */
  public config(): void {
    // Setup middleware.
    this.app.use(
      morgan('combined', {
        stream: {
          write: (message: string) => {
            this.logger.info(message);
          },
        },
      })
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));

    this.app.enable('case sensitive routing');
    this.app.enable('strict routing');
  }

  public async database(): Promise<void> {
    this.connection = await createConnection(databaseConfig);

    for (const seed of seeds) {
      await seed.run(this.connection);
    }
  }

  public async graphql(): Promise<void> {
    let error: Error;
    let gateway: ApolloGateway;
    let services: Service[];

    if (!this.connection || !this.connection.isConnected) {
      error = new Error('database not connected');

      this.logger.error(error.message);

      throw error;
    }

    // Get all the services in the db and add them to a gateway.
    services = await this.connection
      .getRepository(Service)
      .createQueryBuilder('service')
      .getMany();
    gateway = new ApolloGateway({
      serviceList: services.map(({ name, url }) => ({
        name,
        url: `${url}/graphql`,
      })),
    });

    this.graphqlServer = new ApolloServer({
      gateway,
      subscriptions: false,
    });

    this.graphqlServer.applyMiddleware({
      app: this.app,
    });
  }

  /**
   * Convenience function that simply runs Express.listen() and wraps it in a promise with logging.
   * @param {string | number} port
   */
  public listen(port: number): Promise<void> {
    return new Promise((resolve: () => void) => {
      createServer(this.app).listen(port, () => {
        this.logger.info(
          `🚀 blast off in ${
            process.env.NODE_ENV
          } @: ${hostname()} on port: ${port}}`
        );

        resolve();
      });
    });
  }
}
