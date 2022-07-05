import mongoose from 'mongoose';

const FactionPrefixSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    factionId: { type: Number },
    factionPrefix: { type: String },
})

export default mongoose.model('FactionPrefixSchema', FactionPrefixSchema);