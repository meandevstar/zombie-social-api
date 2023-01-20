import assert from 'assert';

import service from 'trades/service';
import survivorService from 'survivors/service';
import { fakeSurvivor } from 'tests/mocks';
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
          },
        ],
        receivedItems: [
          {
            type: ItemType.Water,
            points: 3,
          },
        ],
      },
    );
    const trader1 = await survivorService.getSurvivorById(survivor1._id.toString());
    const trader2 = await survivorService.getSurvivorById(survivor2._id.toString());
    assert.equal(trader1?.inventory[ItemType.Water], 97);
    assert.equal(trader1?.inventory[ItemType.Food], 104);
    assert.equal(trader2?.inventory[ItemType.Water], 103);
    assert.equal(trader2?.inventory[ItemType.Food], 96);
  });
});
