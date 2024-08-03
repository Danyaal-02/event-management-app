import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  supabaseId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('User', userSchema);