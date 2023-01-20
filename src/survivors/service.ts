import { UserStatus } from 'definitions/enums';
import { CreateUser, User } from 'definitions/interfaces';
import { Pagination } from 'definitions/interfaces';
import ZombieError from 'helpers/error';
import Survivor from '../models/survivor';

export default {
  async getSurvivors(limit = 20, page = 0): Promise<Pagination<User>> {
    const survivors = await Survivor.find({ status: UserStatus.Normal })
      .sort('-createdAt')
      .skip(page * limit)
      .limit(limit)
      .lean({ virtuals: true });
    const totalSurvivors = await Survivor.count({ satus: UserStatus.Normal });
    return {
      total: totalSurvivors,
      data: survivors,
    };
  },

  async getSurvivorById(id: string) {
    return await Survivor.findById(id).lean({ virtuals: true });
  },

  async addSurvivor(data: CreateUser) {
    const newSurvivor = new Survivor(data);
    return await newSurvivor.save();
  },

  async updateSurvivor(id: string, data: Partial<User>) {
    // disable inventory update
    if (data.inventory) {
      delete data.inventory;
    }

    return await Survivor.findByIdAndUpdate(id, data, { new: true });
  },

  async reportAsInfected(reporter: string, user: string) {
    const users = await Survivor.find({
      $in: [reporter, user],
    }).select('_id flaggedUsers');

    if (users.length < 2) {
      throw new ZombieError(400, 'Invalid user ids');
    }

    const userDoc = users[0].id === reporter ? users[0] : users[1];
    userDoc.flaggedUsers.push(reporter);
    userDoc.markModified('flaggedUsers');

    if (userDoc.flaggedUsers.length > 2) {
      userDoc.status = UserStatus.Infected;
    }

    await userDoc.save();

    return;
  },
};
