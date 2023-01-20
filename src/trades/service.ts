import { Trade as ITrade, User } from 'definitions/interfaces';
import { RESOURCES_VALUE } from 'definitions/constants';
import Trade from 'models/trade';
import Survivor from 'models/survivor';
import { Document, connection } from 'mongoose';
import ZombieError from 'helpers/error';
import { UserStatus } from 'definitions/enums';

export default {
  async addTrade(data: ITrade) {
    const session = await connection.startSession();

    try {
      let result: any;

      await session.withTransaction(async () => {
        // sender & receiver validation
        const users = await Survivor.find({
          $in: [data.sender, data.receiver],
        });
        if (users.length < 2) {
          throw new ZombieError(400, 'One of survivors not found');
        }
        if (users.some((user) => user.status === UserStatus.Infected)) {
          throw new ZombieError(400, 'Can not trade with infected survivor');
        }

        let sender: Document<unknown, any, User> & User,
          receiver: Document<unknown, any, User> & User;
        if (users[0].id === data.sender) {
          [sender, receiver] = users;
        } else {
          [receiver, sender] = users;
        }

        let senderValue = 0;
        let receiverValue = 0;
        let isSenderOutOfStock = false;
        const newSenderInventory = sender.inventory;
        const newReceiverInventory = receiver.inventory;

        data.sendItems.forEach(item => {
          if (isSenderOutOfStock) {
            return;
          }

          const senderItems = +(newSenderInventory[item.type] || 0);
          const receiverItems = +(newReceiverInventory[item.type] || 0);
          senderValue += RESOURCES_VALUE[item.type] * item.points;
          newSenderInventory[item.type] = senderItems - item.points;
          newReceiverInventory[item.type] = receiverItems + item.points;

          if (newSenderInventory[item.type] < 0) {
            isSenderOutOfStock = true;
          }
        });

        if (isSenderOutOfStock) {
          throw new ZombieError(400, 'Sender inventory does not have enough items');
        }

        data.receivedItems.forEach(item => {
          receiverValue += RESOURCES_VALUE[item.type] * item.points;
          const receiverItems = +(newReceiverInventory[item.type] || 0);
          const senderItems = +(newSenderInventory[item.type] || 0);
          newReceiverInventory[item.type] = receiverItems - item.points;
          newSenderInventory[item.type] = senderItems + item.points;
        });

        if (senderValue !== receiverValue) {
          throw new ZombieError(400, 'The value of resources should be the same');
        }

        
        const [newTrade] = await Promise.all([
          new Trade(data).save(),
          sender.update({
            inventory: newSenderInventory,
          }),
          receiver.update({
            inventory: newReceiverInventory,
          })
        ]);

        result = {
          ...newTrade.toJSON(),
          sender,
          receiver,
        };
      });

      return result;
    } finally {
      await session.endSession();
    }
  },
};
