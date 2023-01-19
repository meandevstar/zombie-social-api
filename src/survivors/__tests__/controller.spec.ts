import assert from 'assert';
import { Document } from 'mongoose';

import { User } from 'definitions/interfaces';
import controller from '../controller';
import * as db from '../../tests/db';
import { fakeSurvivor, inject, reqPlaceholder, resPlaceholder } from 'tests/mocks/survivors';
describe('survivors controller', () => {
  before(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  after(async () => await db.closeDatabase());

  it('should return empty survivors array', async () => {
    const route = inject(controller, { method: 'get', path: '/' });

    const req = {
      body: {},
    };

    const res = {
      json(body: Document[]) {
        assert.deepEqual(body, []);
      },
    };

    await route.handle(req, res);
  });

  it('should create survivor', async () => {
    const addRoute = inject(controller, { method: 'post', path: '/' });
    const getRoute = inject(controller, { method: 'get', path: '/' });

    const req = {
      body: fakeSurvivor,
    };

    const res = {
      json(body: Document[]) {
        const newSurvivor = body[0].toJSON();
        assert.equal(newSurvivor.name, fakeSurvivor.name);
      },
    };

    await addRoute.handle(req, resPlaceholder);
    await getRoute.handle(reqPlaceholder, res);
  });

  it('should get survivor by id', async () => {
    const addRoute = inject(controller, { method: 'post', path: '/' });
    const getRoute = inject(controller, { method: 'get', path: '/:id' });

    let survivor: User | undefined = undefined;

    const addRequest = {
      body: fakeSurvivor,
    };

    const addResponse = {
      json(body: Document) {
        const newSurvivor = body.toJSON();
        survivor = newSurvivor as User;
      },
    };

    await addRoute.handle(addRequest, addResponse);
    if (survivor) {
      await getRoute.handle(
        {
          params: {
            id: (survivor as User).id,
          },
        },
        {
          json(body: Document) {
            const newSurvivor = body.toJSON();
            assert.equal(survivor?.id.toString(), newSurvivor.id.toString());
          },
        },
      );
    }
  });

  it('should update survivor by id', async () => {
    const addRoute = inject(controller, { method: 'post', path: '/' });
    const getRoute = inject(controller, { method: 'get', path: '/' });
    const updateRoute = inject(controller, { method: 'put', path: '/' });

    const updatedName = 'TEST';
    let survivor: User | undefined = undefined;

    const addRequest = {
      body: fakeSurvivor,
    };

    const addResponse = {
      json(body: Document) {
        const newSurvivor = body.toJSON();
        survivor = newSurvivor as User;
      },
    };

    await addRoute.handle(addRequest, addResponse);

    if (survivor) {
      const updateRequest = {
        body: {
          id: (survivor as User).id,
          data: {
            name: updatedName,
          },
        },
      };
      await updateRoute.handle(updateRequest, resPlaceholder);
    }

    await getRoute.handle(reqPlaceholder, {
      json(body: Document[]) {
        const newSurvivor = body[0].toJSON();
        assert.equal(newSurvivor.name, updatedName);
      },
    });
  });

  it('should report survivor as infected', async () => {
    const addRoute = inject(controller, { method: 'post', path: '/' });
    const reportRoute = inject(controller, { method: 'post', path: '/report-as-infected' });
    const getRoute = inject(controller, { method: 'get', path: '/' });

    let survivor1: User | undefined = undefined;
    let survivor2: User | undefined = undefined;

    await addRoute.handle(
      {
        body: fakeSurvivor,
      },
      {
        json(body: Document) {
          const newSurvivor = body.toJSON();
          survivor1 = newSurvivor as User;
        },
      }
    );
    await addRoute.handle(
      {
        body: fakeSurvivor,
      },
      {
        json(body: Document) {
          const newSurvivor = body.toJSON();
          survivor2 = newSurvivor as User;
        },
      }
    );
    if (survivor1 && survivor2) {
      await reportRoute.handle(
        {
          body: {
            reporter: (survivor1 as User)?.id,
            user: (survivor2 as User)?.id,
          }
        },
        resPlaceholder,
      );
    }
    await getRoute.handle(reqPlaceholder, {
      json(body: Document[]) {
        const reportedSurvivor = body[1].toJSON() as User;
        assert.equal(body.length, 2);
        assert.equal(reportedSurvivor.flaggedUsers.length, 1);
      }
    });
  });
});
