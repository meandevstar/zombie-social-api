import { ItemType } from 'definitions/enums';
import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema(
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

const Item = mongoose.model('Item', itemSchema);

export default Item;
