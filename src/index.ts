import { ExpressServer } from './server';

(async (): Promise<void> => {
  const server: ExpressServer = new ExpressServer();

  await server.config();
  await server.api();
  await server.listen(parseInt(process.env.PORT || '3000', 10));
})();
