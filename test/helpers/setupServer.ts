// Server.
import { ExpressServer } from '../../src/server';

export default async function setupServer(): Promise<ExpressServer> {
  const server: ExpressServer = new ExpressServer();

  server.config();
  server.api();
  await server.graphql();

  return server;
}
