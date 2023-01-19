import { CreateUser, User } from 'definitions/interfaces';
import Survivor from '../models/survivor';

export default {
  async getSurvivors() {
    return await Survivor.find().exec();
  },
  async getSurvivorById(id: string) {
    return await Survivor.findById(id);
  },
  async addSurvivor(data: CreateUser) {
    const newSurvivor = new Survivor(data);
    return await newSurvivor.save();
  },
  async updateSurvivor(id: string, data: Partial<User>) {
    await Survivor.updateOne({ _id: id }, data);
    return await Survivor.findById(id);
  },
  async reportAsInfected(reporter: string, user: string) {
    const reporterModel = await Survivor.findById(reporter);
    return Survivor.findOneAndUpdate(
      { _id: user },
      { $push: { flaggedUsers: reporterModel } },
    ).exec();
  },
};
