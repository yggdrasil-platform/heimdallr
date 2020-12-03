// Server.
import { ExpressServer } from '../../src/server';

export default async function setupServer(): Promise<ExpressServer> {
  const server: ExpressServer = new ExpressServer();

  await server.config();
  server.initRoutes();

  return server;
}
