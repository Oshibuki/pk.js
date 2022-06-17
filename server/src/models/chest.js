import mongoose from 'mongoose';

const chest = new mongoose.Schema({
  id: { type: Number, require: true },
  chestid: { type: Number},
  items: { type: String},
});

export default mongoose.model('Chest', chest);
