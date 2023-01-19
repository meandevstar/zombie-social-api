import { CreateUser, User } from 'definitions/interfaces';
import Survivor from '../models/survivor';

export default {
  async getSurvivors() {
    return await Survivor.find().exec();
  },
  async getSurvivorById(id: string) {
    return await Survivor.findById(id);
  },
};
