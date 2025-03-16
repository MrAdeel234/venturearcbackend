import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
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
  investmentInterests: [
    {
      type: String,
    },
  ],
});

const InvestorModel = mongoose.model("Investor", InvestorSchema);
export default InvestorModel;
