import mongoose from 'mongoose';
import crypto from 'crypto';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

import serverConfig from '../../server-config';

const ServerSchema = new mongoose.Schema({
  id: { type: Number, require: true },
  name: { type: String, require: true },

  welcomeMessage: {
    type: String,
    require: true,
    default: 'Welcome to a PK.js powered server.'
  },

  defaultBankGold: {
    type: Number,
    require: true,
    default: 150000
  },
  defaultPouchGold: {
    type: Number,
    require: true,
    default: 10000
  },
  defaultBankLimit: {
    type: Number,
    require: true,
    default: 1000000
  },

  recordStats: {
    type: Boolean,
    require: true,
    default: false
  },

  apiKey: {
    type: String,
    require: true,
    default: () => crypto.randomBytes(20).toString('hex')
  },

  gameserverLastModule: {
    type: String,
    require: true,
    default: "Persistent Kingdoms 1.3.2.1"
  },
  gameserverLastConfig: {
    type: String,
    require: true,
    default: "PK_cfg.txt"
  },
  gameserverRestartCron: {
    type: String,
    default: serverConfig.gameserverRestartCron
  },

  useCustomBanList: {
    type: Boolean,
    default: false
  }
});
ServerSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'serverID' });

export default mongoose.model('Server', ServerSchema);
