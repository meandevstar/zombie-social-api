import assert from 'assert';
import { Response } from 'express';

import service from 'trades/service';
import survivorService from 'survivors/service';
import { fakeSurvivor, resPlaceholder } from 'tests/mocks/survivors';
import * as db from '../../tests/db';
import { ItemType } from 'definitions/enums';

describe('survivors service', () => {
  before(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  after(async () => await db.closeDatabase());

  it('should return empty survivors array', async () => {
    const survivor1 = await survivorService.addSurvivor(fakeSurvivor);
    const survivor2 = await survivorService.addSurvivor(fakeSurvivor);
    await service.addTrade(
      {
        receiver: survivor1._id.toString(),
        sender: survivor2._id.toString(),
        sendItems: [
          {
            type: ItemType.Food,
            points: 4,
            totalCount: 100,
          },
        ],
        receivedItems: [
          {
            type: ItemType.Water,
            points: 3,
            totalCount: 100,
          },
        ],
      },
      resPlaceholder as Response,
    );
    const trader1 = await survivorService.getSurvivorById(survivor1._id.toString());
    const trader2 = await survivorService.getSurvivorById(survivor2._id.toString());
    assert.equal(trader1?.inventory?.get(ItemType.Water), '97');
    assert.equal(trader1?.inventory?.get(ItemType.Food), '104');
    assert.equal(trader2?.inventory?.get(ItemType.Water), '103');
    assert.equal(trader2?.inventory?.get(ItemType.Food), '96');
  });
});
