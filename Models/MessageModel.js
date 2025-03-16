import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderType",
  },
  senderType: {
    type: String,
    required: true,
    enum: ["Entrepreneur", "Investor"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverType",
  },
  receiverType: {
    type: String,
    required: true,
    enum: ["Entrepreneur", "Investor"],
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false
  }
});

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
