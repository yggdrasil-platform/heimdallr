import { ExpressServer } from './server';

(async (): Promise<void> => {
  const server: ExpressServer = new ExpressServer();

  server.config();
  server.api();
  await server.graphql();
  await server.listen(parseInt(process.env.PORT || '3000', 10));
})();
