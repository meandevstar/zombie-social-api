import { UserType } from 'definitions/enums';
import { Gender } from 'definitions/interfaces';
import mongoose, { Schema } from 'mongoose';

const survivorSchema = new Schema(
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
    flaggedUsers: [this],
    inventory: {
      type: Map,
      of: String,
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

const Survivor = mongoose.model('Survivor', survivorSchema);

export default Survivor;
