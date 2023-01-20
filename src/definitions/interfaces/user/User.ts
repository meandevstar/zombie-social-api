import { ItemType, UserStatus, UserType } from 'definitions/enums';
import { PopulatedDoc } from 'mongoose';
import { Gender } from './Gender';

export interface User {
  _id: string;
  id: string;
  name: string;
  age: number;
  gender: Gender;
  type: UserType; // default UserType.Survivor
  status: UserStatus; // default UserStatus.Normal,
  lastLocation: {
    lat: number;
    long: number;
  };
  flaggedUsers: PopulatedDoc<User>[]; // default 0
  inventory: {
    [key in ItemType]: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUser {
  name: string;
  age: number;
  gender: Gender;
  lastLocation: {
    lat: number;
    long: number;
  };
  inventory: {
    [key in ItemType]: number;
  };
}
