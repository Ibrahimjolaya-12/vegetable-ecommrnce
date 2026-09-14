import express from "express";
import { askSabziAi } from "../Controllers/Ai.controller.js";

const router = express.Router();

// Public route taake koi bhi customer sawal pooch sake
router.post("/ask", askSabziAi);

export default router;