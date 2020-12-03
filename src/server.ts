import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { json, urlencoded } from 'body-parser';
import Express, { Application } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { hostname } from 'os';
import { Logger } from 'winston';

// Constants.
import { Endpoints } from './constants';

// Middlewares.
import { errorHandler } from './middlewares';

// Modules.
import { createLogger } from './modules/logger';

// Routers.
import healthcheckRouter from './api/healthcheck/router';

// Types.
import { RouterOptions } from './types';

export class ExpressServer {
  public readonly app: Application;
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
    const options: RouterOptions = {
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

  public async graphql(): Promise<void> {
    const gateway: ApolloGateway = new ApolloGateway({
      serviceList: [{ name: 'accounts', url: 'http://localhost:4001' }],
    });

    this.graphqlServer = new ApolloServer({ gateway });

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
