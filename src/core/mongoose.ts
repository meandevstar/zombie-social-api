import mongoose from 'mongoose';

import { MONGODB_URI } from '../env';

mongoose.connect(MONGODB_URI);
mongoose.set('strictQuery', true);

export default mongoose;
