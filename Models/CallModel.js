import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "callerType",
  },
  callerType: {
    type: String,
    required: true,
    enum: ["Entrepreneur", "Investor"],
  },
  callee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "calleeType",
  },
  calleeType: {
    type: String,
    required: true,
    enum: ["Entrepreneur", "Investor"],
  },
  callStart: {
    type: Date,
    default: Date.now,
  },
  callEnd: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["initiated", "answered", "ended", "missed"],
    default: "initiated",
  }
});

const CallModel = mongoose.model("Call", CallSchema);
export default CallModel;
