import { Trade as ITrade } from 'definitions/interfaces';
import { RESOURCES_VALUE } from 'definitions/constants';
import Trade from 'models/trade';
import Survivor from 'models/survivor';
import { Response } from 'express';

export default {
  async addTrade(data: ITrade, res: Response) {
    const newTrade = new Trade(data);
    const sender = await Survivor.findById(data.sender);
    const receiver = await Survivor.findById(data.receiver);
    if (!sender || !receiver) {
      res.status(400).send({
        message: 'One of survivors not found',
      });
      return;
    }
    let senderValue = 0;
    let receiverValue = 0;
    const newSenderInventory = sender?.inventory;
    const newReceiverInventory = receiver?.inventory;
    for (let i = 0; i < data.sendItems.length; i++) {
      const item = data.sendItems[i];
      senderValue += RESOURCES_VALUE[item.type] * item.points;
      const senderItems = +(newSenderInventory?.get(item.type) || 0);
      const receiverItems = +(newReceiverInventory?.get(item.type) || 0);
      newSenderInventory?.set(item.type, `${senderItems - item.points}`);
      newReceiverInventory?.set(item.type, `${receiverItems + item.points}`);
    }
    for (let i = 0; i < data.receivedItems.length; i++) {
      const item = data.receivedItems[i];
      receiverValue += RESOURCES_VALUE[item.type] * item.points;
      const receiverItems = +(newReceiverInventory?.get(item.type) || 0);
      const senderItems = +(newSenderInventory?.get(item.type) || 0);
      newReceiverInventory?.set(item.type, `${receiverItems - item.points}`);
      newSenderInventory?.set(item.type, `${senderItems + item.points}`);
    }
    if (senderValue !== receiverValue) {
      res.status(400).send({
        message: 'The value of resources should be the same',
      });
      return;
    } else {
      await sender.update({
        inventory: newSenderInventory,
      });
      await receiver.update({
        inventory: newReceiverInventory,
      });
    }

    const newTradeRes = await (await newTrade.save()).toJSON();

    return {
      ...newTradeRes,
      sender,
      receiver,
    };
  },
};
