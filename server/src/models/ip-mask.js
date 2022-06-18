import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const IPMaskSchema = new mongoose.Schema({
  id: { type: Number, require: true },
  ip: { type: String, require: true }
});

IPMaskSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'ipMaskID' });

export default mongoose.model('IPMask', IPMaskSchema);
