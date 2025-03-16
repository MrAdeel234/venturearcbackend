import mongoose from 'mongoose';

const EntrepreneurSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  education: {
    type: String,
    default: null,
  },
  experience: {
    type: Number,
    default: 0,
  },
  Ideas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
    },
  ],
});

const EntrepreneurModel = mongoose.model("Entrepreneur", EntrepreneurSchema);
export default EntrepreneurModel;