import express from "express";
import { signup, login, getChatUsers } from "./Controller.js";
import upload from "../multer/multer.js";

const router = express.Router();

// User routes
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/login", login);
router.get("/getChatUsers/:userId", getChatUsers);

export default router;
