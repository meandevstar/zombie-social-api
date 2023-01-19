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

});
