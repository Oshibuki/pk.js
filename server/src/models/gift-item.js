import mongoose from 'mongoose';

const giftItem = new mongoose.Schema({
    id: { type: Number, require: true },
    itemId: { type: Number },
    itemType: { type: Number },
    itemName: { type: String },
    adequacy: { type: Number },
});

export default mongoose.model('giftItem', giftItem);