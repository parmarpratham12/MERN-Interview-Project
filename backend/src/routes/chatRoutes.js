import express from "express";
import { getStremToken } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express = express.Router();

router.get("/token", protectRoute ,getStreamToken)

export default router;
