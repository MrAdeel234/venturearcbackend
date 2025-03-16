import express from "express";
import { postIdea, getIdeas, getUserIdeas, updateIdea, deleteIdea } from './IdeaController.js';
const router = express.Router();

// User routes
router.post("/ideas", postIdea)
router.get("/ideas", getIdeas)
router.get("/ideas/:userId", getUserIdeas)
router.put("/ideas/:ideaId", updateIdea)
router.delete("/ideas/:ideaId", deleteIdea)

export default router;
