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

});
