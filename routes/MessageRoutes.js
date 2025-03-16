import express from "express";
import MessageModel from "../Models/MessageModel.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Get previous messages between two users
router.get(
  "/:senderId/:senderType/:receiverId/:receiverType",
  async (req, res) => {
    try {
      const { senderId, senderType, receiverId, receiverType } = req.params;

      // Mark messages as read when fetching them
      await MessageModel.updateMany(
        {
          sender: receiverId,
          senderType: receiverType,
          receiver: senderId,
          receiverType: senderType,
          read: false
        },
        { $set: { read: true } }
      );

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

// ✅ Save a new message
router.post("/", async (req, res) => {
  try {
    const { sender, senderType, receiver, receiverType, message } = req.body;

    const newMessage = new MessageModel({
      sender,
      senderType,
      receiver,
      receiverType,
      message,
      read: false
    });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark messages as read
router.put("/markRead", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Update all unread messages from sender to receiver
    const result = await MessageModel.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({ 
      success: true, 
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get unread message counts for a user
router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Aggregate unread messages by sender
    const unreadCounts = await MessageModel.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(userId),
          read: false
        }
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to the expected format
    const counts = {};
    unreadCounts.forEach(item => {
      counts[item._id.toString()] = item.count;
    });

    res.json({ counts });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get last message between two users
router.get("/last/:userId1/:userId2", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const lastMessage = await MessageModel.findOne({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ timestamp: -1 });

    res.json(lastMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
