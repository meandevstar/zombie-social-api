import assert from 'assert';

import { Pagination, User } from 'definitions/interfaces';
import { ItemType } from 'definitions/enums';
import { fakeSurvivor, inject, fakeRequest, fakeResponse } from 'tests/mocks';
import controller from 'trades/controller';
import survivorController from 'survivors/controller';
import * as db from '../../tests/db';

describe('trade controller', () => {
  before(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  after(async () => await db.closeDatabase());

  it('should trade resources', async () => {
    const getRoute = inject(survivorController, { method: 'get', path: '/' });
    const addRoute = inject(survivorController, { method: 'post', path: '/' });
    const tradeRoute = inject(controller, { method: 'post', path: '/' });

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
      },
    );
    await addRoute.handle(
      {
        body: fakeSurvivor,
      },
      {
        json(body: User) {
          survivor2 = body;
        },
      },
    );
    if (survivor1 && survivor2) {
      await tradeRoute.handle(
        {
          body: {
            receiver: (survivor1 as User)?._id.toString(),
            sender: (survivor2 as User)?._id.toString(),
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
        },
        fakeResponse,
      );

      await getRoute.handle(fakeRequest, {
        json(body: Pagination<User>) {
          const trader1 = body.data[0];
          const trader2 = body.data[1];
          assert.equal(trader1.inventory.WATER, '103');
          assert.equal(trader1.inventory.FOOD, '96');
          assert.equal(trader2.inventory.WATER, '97');
          assert.equal(trader2.inventory.FOOD, '104');
        }
      })
    }
  });
});
