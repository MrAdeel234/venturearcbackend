import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  address: { type: String, required: true },
  profilePhoto: { type: String, default: null }, // Store base64 string
});

const User = mongoose.model('User', userSchema);
export default User;
