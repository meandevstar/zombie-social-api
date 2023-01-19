import { ItemType } from 'definitions/enums';
import mongoose, { Schema } from 'mongoose';

const tradeSchema = new Schema(
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
        totalCount: Number,
        createdAt: Date,
        updatedAt: Date,
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
        totalCount: Number,
        createdAt: Date,
        updatedAt: Date,
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

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
