import assert from 'assert';
import { Document } from 'mongoose';

import { User } from 'definitions/interfaces';
import { ItemType } from 'definitions/enums';
import { fakeSurvivor, inject, reqPlaceholder, resPlaceholder } from 'tests/mocks/survivors';
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
        json(body: Document) {
          survivor1 = body.toJSON();
        },
      },
    );
    await addRoute.handle(
      {
        body: fakeSurvivor,
      },
      {
        json(body: Document) {
          survivor2 = body.toJSON();
        },
      },
    );
    if (survivor1 && survivor2) {
      await tradeRoute.handle(
        {
          body: {
            receiver: (survivor1 as User)?.id,
            sender: (survivor2 as User)?.id,
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
        resPlaceholder,
      );

      await getRoute.handle(reqPlaceholder, {
        json(body: Document[]) {
          const trader1 = body[0].toJSON() as User;
          const trader2 = body[1].toJSON() as User;
          assert.equal(trader1.inventory.WATER, '97');
          assert.equal(trader1.inventory.FOOD, '104');
          assert.equal(trader2.inventory.WATER, '103');
          assert.equal(trader2.inventory.FOOD, '96');
        }
      })
    }
  });
});
