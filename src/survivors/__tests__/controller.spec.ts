import assert from 'assert';
import { Document } from 'mongoose';

import { Pagination, User } from 'definitions/interfaces';
import controller from '../controller';
import * as db from '../../tests/db';
import { fakeSurvivor, inject, fakeRequest, fakeResponse } from 'tests/mocks';

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
      json(body: Pagination<Document>) {
        assert.deepEqual(body.data, []);
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
      json(body: Pagination<User>) {
        const newSurvivor = body.data[0];
        assert.equal(newSurvivor.name, fakeSurvivor.name);
      },
    };

    await addRoute.handle(req, fakeResponse);
    await getRoute.handle(fakeRequest, res);
  });

  it('should get survivor by id', async () => {
    const addRoute = inject(controller, { method: 'post', path: '/' });
    const getRoute = inject(controller, { method: 'get', path: '/:id' });

    let survivor: User | undefined = undefined;

    const addRequest = {
      body: fakeSurvivor,
    };

    const addResponse = {
      json(body: User) {
        survivor = body;
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
          json(body: User) {
            const newSurvivor = body;
            assert.equal(survivor?._id.toString(), newSurvivor._id.toString());
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
      json(body: User) {
        survivor = body;
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
      await updateRoute.handle(updateRequest, fakeResponse);
    }

    await getRoute.handle(fakeRequest, {
      json(body: Pagination<User>) {
        const newSurvivor = body.data[0];
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
        json(body: User) {
          survivor1 = body;
        },
      }
    );
    await addRoute.handle(
      {
        body: fakeSurvivor,
      },
      {
        json(body: User) {
          survivor2 = body;
        },
      }
    );
    if (survivor1 && survivor2) {
      await reportRoute.handle(
        {
          body: {
            reporter: (survivor1 as User)?._id,
            user: (survivor2 as User)?._id,
          }
        },
        fakeResponse,
      );
    }
    await getRoute.handle(fakeRequest, {
      json(body: Pagination<User>) {
        const reportedSurvivor = body.data[0];
        assert.equal(body.data.length, 2);
        assert.equal(reportedSurvivor.flaggedUsers.length, 1);
      }
    });
  });
});
