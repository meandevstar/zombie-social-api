import { ItemType, UserType } from 'definitions/enums';
import { Gender, User } from 'definitions/interfaces';
import mongoose, { Schema } from 'mongoose';

const survivorSchema = new Schema<User>(
  {
    name: String,
    age: Number,
    gender: {
      type: String,
      default: Gender.Female,
      enum: Object.values(Gender),
    },
    type: {
      type: String,
      default: UserType.Survivor,
      enum: Object.values(UserType),
    },
    lastLocation: {
      lat: Number,
      long: Number,
    },
    flaggedUsers: [{
      type: Schema.Types.ObjectId,
      model: 'User',
    }],
    inventory: {
      [ItemType.Ammunition]: {
        type: Number,
        default: 0,
      },
      [ItemType.Food]: {
        type: Number,
        default: 0,
      },
      [ItemType.Medication]: {
        type: Number,
        default: 0,
      },
      [ItemType.Water]: {
        type: Number,
        default: 0,
      },
    },
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

survivorSchema.index({ status: 1, createdAt: -1 });

const Survivor = mongoose.model('Survivor', survivorSchema);

export default Survivor;
