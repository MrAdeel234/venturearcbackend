import express from "express";
import MessageModel from "../Models/MessageModel.js";

const router = express.Router();

// Get Previous Messages
router.get(
  "/:senderId/:senderType/:receiverId/:receiverType",
  async (req, res) => {
    console.log("Get Previous Messages");
    try {
      const { senderId, senderType, receiverId, receiverType } = req.params;

      const messages = await MessageModel.find({
        $or: [
          { sender: senderId, senderType, receiver: receiverId, receiverType },
          {
            sender: receiverId,
            senderType: receiverType,
            receiver: senderId,
            receiverType: senderType,
          },
        ],
      }).sort({ timestamp: 1 });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Send Message
router.post("/messages", async (req, res) => {
  try {
    const { sender, senderType, receiver, receiverType, message } = req.body;

    const newMessage = new MessageModel({
      sender,
      senderType,
      receiver,
      receiverType,
      message,
    });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
