import mongoose from 'mongoose';

const house = new mongoose.Schema({
  id: { type: Number, require: true },
  guid: { type: String},
  houseid: { type: Number},
});

export default mongoose.model('House', house);
