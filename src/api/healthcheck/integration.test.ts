import { Application } from 'express';
import { agent } from 'supertest';

// Constants.
import { Endpoints } from '../../constants';

// Helpers.
import { setupServer } from '../../../test/helpers';

interface Scope {
  app: Application;
}

describe(Endpoints.HEALTHCHECK, () => {
  let scope: Scope;

  beforeEach(async () => {
    const { app } = await setupServer();

    scope = {
      app,
    };
  });

  describe(`GET ${Endpoints.HEALTHCHECK}`, () => {
    it('should return a 200', async () => {
      await agent(scope.app).get(Endpoints.HEALTHCHECK).expect(200);
    });
  });
});
