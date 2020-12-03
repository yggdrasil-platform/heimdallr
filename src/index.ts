import { ExpressServer } from './server';

(async (): Promise<void> => {
  const server: ExpressServer = new ExpressServer();

  await server.config();
  await server.initRoutes();
  await server.listen(parseInt(process.env.PORT || '3000', 10));
})();
