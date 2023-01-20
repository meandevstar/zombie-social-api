import { ItemType } from 'definitions/enums';
import { Trade } from 'definitions/interfaces';
import mongoose, { Schema } from 'mongoose';

// TODO: add status and approval/deny implementation
const tradeSchema = new Schema<Trade>(
  {
    sender: String,
    receiver: String,
    sendItems: [
      {
        type: {
          type: String,
          default: ItemType.Water,
          enum: Object.values(ItemType),
        },
        points: Number,
      },
    ],
    receivedItems: [
      {
        type: {
          type: String,
          default: ItemType.Water,
          enum: Object.values(ItemType),
        },
        points: Number,
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

tradeSchema.index({ status: 1, createdAt: -1 });

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
