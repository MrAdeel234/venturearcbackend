import CallModel from "../Models/CallModel.js";

export const initiateCall = async (req, res) => {
  try {
    const { caller, callerType, callee, calleeType } = req.body;
    const call = new CallModel({
      caller,
      callerType,
      callee,
      calleeType,
      status: "initiated",
    });
    const savedCall = await call.save();
    res.status(201).json(savedCall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const answerCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const call = await CallModel.findById(callId);
    if (!call) {
      return res.status(404).json({ error: "Call not found" });
    }
    call.status = "answered";
    await call.save();
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const endCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const call = await CallModel.findById(callId);
    if (!call) {
      return res.status(404).json({ error: "Call not found" });
    }
    call.status = "ended";
    call.callEnd = new Date();
    await call.save();
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCallLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const calls = await CallModel.find({
      $or: [{ caller: userId }, { callee: userId }]
    }).sort({ callStart: -1 });
    res.status(200).json(calls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
