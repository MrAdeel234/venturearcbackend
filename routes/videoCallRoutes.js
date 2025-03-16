import express from "express";
import { initiateCall, answerCall, endCall, getCallLogs } from "../controllers/videoCallController.js";

const router = express.Router();

router.post("/initiate", initiateCall);
router.post("/answer", answerCall);
router.post("/end", endCall);
router.get("/call-logs/:userId", getCallLogs);

export default router;
