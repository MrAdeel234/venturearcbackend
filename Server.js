// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import ideaRoutes from "./routes/IdeaRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js"
import MessageModel from "./Models/MessageModel.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://adeelmazhar778:adeel@cluster0.c5ydg.mongodb.net/ventureArc?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose
  .connect(uri, clientOptions)
  .then(() => console.log("Connected to MongoDB Database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/", ideaRoutes);
app.use("/api/messages", messageRoutes);

// Setup Socket.io
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Map to keep track of connected users (store user id as string)
const usersSocketMap = {};

io.on("connection", (socket) => {
  console.log("New client connected. Socket ID:", socket.id);

  // Setup event – store user ID as string
  socket.on("setup", (userData) => {
    const userId = userData._id.toString();
    usersSocketMap[userId] = socket.id;
    console.log("User setup:", userId, "Socket ID:", socket.id);
  });

  // Chat messaging handler
  socket.on("sendMessage", async (messageData) => {
    try {
      console.log("Message received:", messageData);
      const newMessage = new MessageModel({
        sender: messageData.sender,
        senderType: messageData.senderType || "Investor",
        receiver: messageData.receiver,
        receiverType: messageData.receiverType || "Entrepreneur",
        message: messageData.message,
        timestamp: messageData.timestamp || Date.now(),
        read: false,
      });
      const savedMessage = await newMessage.save();
      console.log("Message saved:", savedMessage);
      const receiverSocketId = usersSocketMap[messageData.receiver.toString()];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("receiveMessage", savedMessage);
      }
      socket.emit("messageSaved", { success: true, message: savedMessage });
    } catch (error) {
      console.error("Error saving message:", error.message);
      socket.emit("messageSaved", { success: false, error: error.message });
    }
  });

  // Video Call Signaling Handlers

  socket.on("callUser", (data) => {
    console.log("callUser event received on server with data:", data);
    const targetSocketId = usersSocketMap[data.userToCall.toString()];
    console.log(
      "CallUser event: from",
      data.from,
      "to",
      data.userToCall,
      "Target Socket:",
      targetSocketId
    );
    if (targetSocketId) {
      socket.to(targetSocketId).emit("incomingCall", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    } else {
      console.log("Target user not connected:", data.userToCall);
    }
  });

  socket.on("answerCall", (data) => {
    const targetSocketId = usersSocketMap[data.to.toString()];
    console.log(
      "AnswerCall event: from",
      data.to,
      "Target Socket:",
      targetSocketId
    );
    if (targetSocketId) {
      socket.to(targetSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("iceCandidate", (data) => {
    const targetSocketId = usersSocketMap[data.to.toString()];
    if (targetSocketId) {
      socket.to(targetSocketId).emit("iceCandidate", data.candidate);
    }
  });

  socket.on("endCall", (data) => {
    const targetSocketId = usersSocketMap[data.to.toString()];
    if (targetSocketId) {
      socket.to(targetSocketId).emit("endCall");
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of Object.entries(usersSocketMap)) {
      if (sockId === socket.id) {
        delete usersSocketMap[userId];
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
