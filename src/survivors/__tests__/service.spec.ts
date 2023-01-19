import assert from 'assert';

import service from 'survivors/service';
import { fakeSurvivor } from 'tests/mocks/survivors';
import * as db from '../../tests/db';

describe('survivors service', () => {
  before(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  after(async () => await db.closeDatabase());

  it('should return empty survivors array', async () => {
    const survivors = await service.getSurvivors();
    assert.deepEqual(survivors, []);
  });

  it('should add survivor', async () => {
    await service.addSurvivor(fakeSurvivor);
    const survivors = await service.getSurvivors();
    assert.equal(survivors.length, 1);
  });
});
